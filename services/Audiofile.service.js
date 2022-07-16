const mongoose = require('mongoose');
const APIError = require('../middleware/apiErrors.middleware');
const Audiofile = require('../models/Audiofile');
const ContentPreferences = require('../models/ContentPreferences');
const Group = require('../models/Group');
const checkPrivileges = require('../util/checkGroupUserPrivileges');


exports.createAudiofileService = async (name, artist, groupId, audiofile, uploader) => {
    const _id =  new mongoose.Types.ObjectId();
    if(groupId){
        const group = await Group.findById(groupId);
        const uploadFilesLevel = group.policies.canUploadFiles;
        const check = checkPrivileges(group, uploader, uploadFilesLevel);
        if(!check) throw APIError.ForbiddenError();
        await group.updateOne({$push: {videos: _id}});
    }
    await Audiofile.create({_id, name, artist, audiofile, uploader: mongoose.Types.ObjectId(uploader)});
    if(groupId) await Audiofile.findByIdAndUpdate(_id, {$push: {groups: groupId}});
    const newAudio = await Audiofile.findById(_id);
    return newAudio;
}


exports.getAllAudiofilesService = async (page) => {
    const limit = 25;
    const musicNumber = await Audiofile.find().count();
    const music = await Audiofile.find().sort({createdAt: 'desc'}).limit(limit).skip((page - 1) * limit);
    const totalPages = Math.ceil(musicNumber / limit);
    const more = page * limit < musicNumber;
    return {music, totalPages, more};
}


exports.getGroupAudioService = async (groupId, page) => {
    const limit = 25;
    const musicNumber = await Audiofile.find({groups: {$in: groupId}}).count();
    const music = await Audiofile.find({groups: {$in: groupId}}).sort({createdAt: 'desc'}).limit(limit).skip((page - 1) * limit);
    const totalPages = Math.ceil(musicNumber / limit);
    const more = page * limit < musicNumber;
    return {music, totalPages, more};
}


exports.addRemoveAudioToGroupService = async (audioId, groupId, userId) => {
    const audio = await Audiofile.findById(audioId);
    const group = await Group.findById(groupId);
    const uploadFilesLevel = group.policies.canUploadFiles;
    const check = checkPrivileges(group, userId, uploadFilesLevel);
    if(!check) throw APIError.ForbiddenError();
    let isAdded = false;
    if(!audio.groups.includes(groupId)){
        await audio.updateOne({$push: {groups: groupId}});
        await group.updateOne({$push: {music: audioId}});
        isAdded = true;
    } else {
        await audio.updateOne({$pull: {groups: groupId}});
        await group.updateOne({$pull: {music: audioId}});
    }
    const updatedAudio = await Audiofile.findById(audioId);
    return { audio: updatedAudio, isAdded };
}


exports.getAudiofilesUploadedByUserService = async (userId, page) => {
    const limit = 25;
    const musicNumber = await Audiofile.find({uploader: mongoose.Types.ObjectId(userId)}).count();
    const music = await Audiofile.find({uploader: mongoose.Types.ObjectId(userId)}).sort({createdAt: 'desc'}).limit(limit).skip((page - 1) * limit);
    const totalPages = Math.ceil(musicNumber / limit);
    const more = page * limit < musicNumber;
    return {music, totalPages, more};
}


exports.getSingleAudioService = async (id) => {
    const audio = await Audiofile.findById(id);
    return audio;
}


exports.getSpecificAudiofilesService = async (search, page) => {
    const limit = 25;
    let regex = new RegExp(search, 'i');
    const musicNumber = await Audiofile.find({$or: [{name: regex}, {artist: regex}]}).count();
    const music = await Audiofile.find({$or: [{name: regex}, {artist: regex}]}).sort({createdAt: 'desc'}).limit(limit).skip((page - 1) * limit);
    const totalPages = Math.ceil(musicNumber / limit);
    const more = page * limit < musicNumber;
    return {music, totalPages, more};
}


exports.setFavoriteAudiofileService = async (fileId, userId) => {
    const file = await Audiofile.findById(fileId);
    const prefs = await ContentPreferences.findOne({user: userId});
    if(!file.favorite.includes(mongoose.Types.ObjectId(userId))){
        await file.updateOne({$push: {favorite: mongoose.Types.ObjectId(userId)}});
        await prefs.updateOne({$push: {audioFavorites: mongoose.Types.ObjectId(fileId)}});
        return true;
    }else{
        await file.updateOne({$pull: {favorite: mongoose.Types.ObjectId(userId)}});
        await prefs.updateOne({$pull: {audioFavorites: mongoose.Types.ObjectId(fileId)}});
        return false;
    }
}


exports.deleteAudiofileService = async (fileId, userId) => {
    const audiofile = await Audiofile.findById(fileId);
    if(audiofile.uploader.toString() !== userId) throw APIError.ForbiddenError();
    if(audiofile.groups.length > 0){
        await Group.updateMany({music: {$in: fileId}}, {$pull: {music: fileId}});
    }
    await audiofile.deleteOne();
    return;
}