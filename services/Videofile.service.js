const mongoose = require('mongoose');
const APIError = require('../middleware/apiErrors.middleware');
const Videofile = require('../models/Videofile');
const Group = require('../models/Group');
const ContentPreferences = require('../models/ContentPreferences');
const checkPrivileges = require('../util/checkGroupUserPrivileges');


exports.createVideoService = async (name, videofile, groupId, description, uploader, tags) => {
    const _id = new mongoose.Types.ObjectId();
    if(groupId){
        const group = await Group.findById(groupId);
        const uploadFilesLevel = group.policies.canUploadFiles;
        const check = checkPrivileges(group, uploader, uploadFilesLevel);
        if(!check) throw APIError.ForbiddenError();
        await group.updateOne({$push: {videos: _id}});
    }
    await Videofile.create({ _id, name, videofile, description, tags, uploader: mongoose.Types.ObjectId(uploader) });
    if(groupId) await Videofile.findByIdAndUpdate(_id, {$push: {groups: groupId}});
    const video = await Videofile.findById(_id).populate('uploader', '_id email username profilePicture');
    return video;
}

exports.getAllVideoService = async (page) => {
    const limit = 24;
    const videosNumber = await Videofile.find().count();
    const videos = await Videofile.find().sort({createdAt: 'desc'}).limit(limit).skip((page - 1) * limit).populate('uploader', '_id email username profilePicture');
    const totalPages = Math.ceil(videosNumber / limit);
    const more = page * limit < videosNumber;
    return {videos, totalPages, more};
}

exports.getGroupVideoService = async (groupId, page) => {
    const limit = 24;
    const videosNumber = await Videofile.find({groups: {$in: groupId}}).count();
    const videos = await Videofile.find({groups: {$in: groupId}}).sort({createdAt: 'desc'}).limit(limit).skip((page - 1) * limit).populate('uploader', '_id email username profilePicture');
    const totalPages = Math.ceil(videosNumber / limit);
    const more = page * limit < videosNumber;
    return {videos, totalPages, more};
}

exports.addRemoveVideoToGroupService = async (videoId, groupId, userId) => {
    const video = await Videofile.findById(videoId);
    const group = await Group.findById(groupId);
    const uploadFilesLevel = group.policies.canUploadFiles;
    const check = checkPrivileges(group, userId, uploadFilesLevel);
    if(!check) throw APIError.ForbiddenError();
    let isAdded = false;
    if(!video.groups.includes(groupId)){
        await video.updateOne({$push: {groups: groupId}});
        await group.updateOne({$push: {videos: videoId}});
        isAdded = true;
    } else {
        await video.updateOne({$pull: {groups: groupId}});
        await group.updateOne({$pull: {videos: videoId}});
    }
    const updatedVideo = await Videofile.findById(videoId).populate('uploader', '_id email username profilePicture');
    return { video: updatedVideo, isAdded };
}

exports.getVideoUploadedByUserService = async (userId, page) => {
    const limit = 24;
    const videosNumber = await Videofile.find({uploader: mongoose.Types.ObjectId(userId)}).count();
    const videos = await Videofile.find({ uploader: mongoose.Types.ObjectId(userId) }).sort({createdAt: 'desc'}).limit(limit).skip((page - 1) * limit).populate('uploader', '_id email username profilePicture');
    const totalPages = Math.ceil(videosNumber / limit);
    const more = page * limit < videosNumber;
    return {videos, totalPages, more};
}

exports.getSingleVideoService = async (id) => {
    const video = await Videofile.findById(id).populate('uploader', '_id username email profilePicture followers').populate('comments');
    await Videofile.findByIdAndUpdate(id, { views: video.views + 1 });
    return video;
}

exports.getSpecificVideoService = async (search, page) => {
    const regex = new RegExp(search, 'i');
    const limit = 24;
    const videosNumber = await Videofile.find({ name: regex }).count();
    const videos = await Videofile.find({ name: regex }).sort({createdAt: 'desc'}).limit(limit).skip((page - 1) * limit).populate('uploader', '_id email username profilePicture');
    const totalPages = Math.ceil(videosNumber / limit);
    const more = page * limit < videosNumber;
    return {videos, totalPages, more};
}

exports.getVideosByTagService = async (tag, page) => {
    const tagString = `#${tag}`;
    const limit = 24;
    const videosNumber = await Videofile.find({tags: {$in: tagString}}).count();
    const videos = await Videofile.find({tags: {$in: tagString}}).sort({createdAt: 'desc'}).limit(limit).skip((page - 1) * limit).populate('uploader', '_id email username profilePicture');
    const totalPages = Math.ceil(videosNumber / limit);
    const more = page * limit < videosNumber;
    return {videos, totalPages, more};
}

exports.editVideoService = async (videoId, videoData) => {
    const { name, videofile, description, tags, uploader } = videoData;
    const video = await Videofile.findById(videoId);
    if(video.uploader.toString() !== uploader) throw APIError.ForbiddenError();
    await video.updateOne({ name, videofile, description, tags });
    const updatedVideo = await Videofile.findById(videoId).populate('uploader', '_id username email profilePicture followers');
    return updatedVideo;
}

exports.deleteVideoService = async (videoId, userId) => {
    const video = await Videofile.findById(videoId);
    if(video.uploader.toString() !== userId) throw APIError.ForbiddenError();
    if(video.groups.length > 0){
        await Group.updateMany({videos: {$in: videoId}}, {$pull: {videos: videoId}});
    }
    await video.deleteOne();
    return;
}

exports.likeVideoService = async (videoId, userId) => {
    const video = await Videofile.findById(videoId);
    if(video.dislikes.includes(userId)) await video.updateOne({ $pull: { dislikes: userId } });
    if(!video.likes.includes(userId)){
        await video.updateOne({ $push: { likes: userId } });
        return true;
    } else {
        await video.updateOne({ $pull: { likes: userId } });
        return false;
    }
}

exports.dislikeVideoService = async (videoId, userId) => {
    const video = await Videofile.findById(videoId);
    if(video.likes.includes(userId)) await video.updateOne({ $pull: { likes: userId } });
    if(!video.dislikes.includes(userId)){
        await video.updateOne({ $push: { dislikes: userId } });
        return true;
    } else {
        await video.updateOne({ $pull: { dislikes: userId } });
        return false;
    }
}

exports.setFavoriteVideoService = async (fileId, userId) => {
    const file = await Videofile.findById(fileId);
    const prefs = await ContentPreferences.findOne({user: userId});
    if(!file.favorite.includes(mongoose.Types.ObjectId(userId))){
        await file.updateOne({ $push: { favorite: mongoose.Types.ObjectId(userId) } });
        await prefs.updateOne({ $push: { audioFavorites: mongoose.Types.ObjectId(fileId)}});
        return true;
    }else{
        await file.updateOne({$pull: {favorite: mongoose.Types.ObjectId(userId)}});
        await prefs.updateOne({$pull: {audioFavorites: mongoose.Types.ObjectId(fileId)}});
        return false;
    }
}