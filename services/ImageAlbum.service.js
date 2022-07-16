const mongoose = require('mongoose');
const APIError = require('../middleware/apiErrors.middleware');
const ImageAlbum = require('../models/ImageAlbum');
const Image = require('../models/ImageFile');
const User = require('../models/User');
const Group = require('../models/Group');
const checkPrivileges = require('../util/checkGroupUserPrivileges');


exports.createAlbumService = async (name, owner, groupId) => {
    const _id = new mongoose.Types.ObjectId();
    if(groupId){
        const group = await Group.findById(groupId);
        const createAlbumLevel = group.policies.canCreateAlbums;
        const check = checkPrivileges(group, owner, createAlbumLevel);
        if(!check) throw APIError.ForbiddenError();
        const album = await ImageAlbum.create({_id, name, owner: new mongoose.Types.ObjectId(owner), groupId: new mongoose.Types.ObjectId(groupId), 'albumSettings.isGroupAlbum': true});
        await Group.findByIdAndUpdate(groupId, {$push: {imageAlbums: _id}});
        return album;
    }else{
        const album = await ImageAlbum.create({_id, name, owner: new mongoose.Types.ObjectId(owner), 'albumSettings.isGroupAlbum': false});
        await User.findByIdAndUpdate(owner, {$push: {imageAlbums: _id}});
        return album;
    }
}


exports.getAllAlbumsService = async (ownerId) => {
    const albums = await ImageAlbum.find({owner: mongoose.Types.ObjectId(ownerId), 'albumSettings.isGroupAlbum': false}).populate('lastImage');
    return albums;
}


exports.getAllGroupAlbumsService = async (groupId) => {
    const albums = await ImageAlbum.find({groupId}).populate('lastImage');
    return albums;
}


exports.getAlbumService = async (albumId) => {
    const album = await ImageAlbum.findById(albumId).populate('images');
    return album;
}


exports.getOneOfGroupService = async (albumId, groupId, userId) => {
    const group = await Group.findById(groupId);
    const isMember = group.members.includes(userId);
    const album = await ImageAlbum.findById(albumId).populate('images');
    if(album.albumSettings.isGroupPrivate && !isMember) throw APIError.ForbiddenError();
    return album;
}


exports.updateAlbumService = async (albumId, userId, name) => {
    const album = await ImageAlbum.findById(albumId);
    if(album.albumSettings.isGroupAlbum){
        if(album.albumSettings.isGroupLocked) throw APIError.ForbiddenError();
        const group = await Group.findById(album.groupId);
        const editGroupInfoLevel = group.policies.canEditGroupInfo;
        let check = checkPrivileges(group, userId, editGroupInfoLevel);
        if(!check || album.owner.toString() !== userId) throw APIError.ForbiddenError();
    } else {
        if(album.owner.toString() !== userId) throw APIError.ForbiddenError();
    }
    await album.updateOne({name: name});
    const updated = await ImageAlbum.findById(albumId).populate('images');
    return updated;
}


exports.lockGroupAlbumService = async (albumId, userId) => {
    const album = await ImageAlbum.findById(albumId);
    const group = await Group.findById(album.groupId);
    const editGroupInfoLevel = group.policies.canEditGroupInfo;
    let check = checkPrivileges(group, userId, editGroupInfoLevel);
    if(!check) throw APIError.ForbiddenError();
    if(!album.albumSettings.isGroupLocked){
        await album.updateOne({'albumSettings.isGroupLocked': true});
        return true;
    } else {
        await album.updateOne({'albumSettings.isGroupLocked': false});
        return false;
    }
}


exports.privateGroupAlbumService = async (albumId, userId) => {
    const album = await ImageAlbum.findById(albumId);
    if(album.albumSettings.isGroupAlbum){
        const group = await Group.findById(album.groupId);
        const editGroupInfoLevel = group.policies.canEditGroupInfo;
        let check = checkPrivileges(group, userId, editGroupInfoLevel);
        if(!check) throw APIError.ForbiddenError();
        if(album.albumSettings.isGroupLocked) throw APIError.ForbiddenError();
        if(!album.albumSettings.isGroupPrivate){
            await album.updateOne({'albumSettings.isGroupPrivate': true});
            return true;
        } else {
            await album.updateOne({'albumSettings.isGroupPrivate': false});
            return false;
        }
    } else {
        if(!album.albumSettings.isUserPrivate){
            await album.updateOne({'albumSettings.isUserPrivate': true});
            return true;
        } else {
            await album.updateOne({'albumSettings.isUserPrivate': false});
            return false;
        }
    }
}


exports.deletePreserveAlbumService = async (albumId, userId) => {
    const albumForDeletion = await ImageAlbum.findById(albumId);
    if(albumForDeletion.albumSettings.isGroupAlbum){
        const group = await Group.findById(albumForDeletion.groupId);
        const editGroupInfoLevel = group.policies.canEditGroupInfo;
        let check = checkPrivileges(group, userId, editGroupInfoLevel);
        if(!check || albumForDeletion.owner.toString() !== userId) throw APIError.ForbiddenError();
    } else {
        if(albumForDeletion.owner.toString() !== userId) throw APIError.ForbiddenError();
    }
    if(albumForDeletion.albumSettings.isRootAlbum) throw APIError.BadRequestError('Cannot delete the root album');
    let rootAlbum;
    if(albumForDeletion.albumSettings.isGroupAlbum){
        rootAlbum = await ImageAlbum.findOne({groupId: albumForDeletion.groupId, 'albumSettings.isRootAlbum': true});
    } else {
        rootAlbum = await ImageAlbum.findOne({owner: userId, 'albumSettings.isRootAlbum': true});
    }
    const images = await Image.find({album: mongoose.Types.ObjectId(albumId)});
    if(images) {
        let transferredImagesId = images.map(i => i._id);
        await rootAlbum.updateOne({$push: {images: {$each: [...transferredImagesId]}, lastImage: transferredImagesId[transferredImagesId.length - 1]}});
        await Image.updateMany({album: mongoose.Types.ObjectId(albumId)}, {album: mongoose.Types.ObjectId(rootAlbum._id)});
    }
    await User.findByIdAndUpdate(userId, {$pull: {imageAlbums: mongoose.Types.ObjectId(albumId)}});
    await ImageAlbum.findByIdAndDelete(albumId);
    return;
}


exports.deleteFullAlbumService = async (albumId, userId) => {
    const albumForDeletion = await ImageAlbum.findById(albumId);
    if(albumForDeletion.albumSettings.isGroupAlbum){
        const group = await Group.findById(albumForDeletion.groupId);
        const editGroupInfoLevel = group.policies.canEditGroupInfo;
        let check = checkPrivileges(group, userId, editGroupInfoLevel);
        if(!check || albumForDeletion.owner.toString() !== userId) throw APIError.ForbiddenError();
    } else {
        if(albumForDeletion.owner.toString() !== userId) throw APIError.ForbiddenError();
    }
    if(albumForDeletion.albumSettings.isRootAlbum) throw APIError.BadRequestError('Cannot delete the root album');
    await Image.deleteMany({album: mongoose.Types.ObjectId(albumId)})
    await User.findByIdAndUpdate(userId, {$pull:{imageAlbums: mongoose.Types.ObjectId(albumId)}});
    await ImageAlbum.findByIdAndDelete(albumId);
    return;
}