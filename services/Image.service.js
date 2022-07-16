const mongoose = require('mongoose');
const APIError = require('../middleware/apiErrors.middleware');
const Imagefile = require('../models/ImageFile');
const ImageAlbum = require('../models/ImageAlbum');
const Group = require ('../models/Group');
const checkPrivileges = require('../util/checkGroupUserPrivileges');


exports.createImageService = async (name, imagefile, album, uploader) => {
    const imageAlbum = await ImageAlbum.findById(album);
    if(imageAlbum.albumSettings.isGroupAlbum === true){
        if(imageAlbum.albumSettings.isGroupLocked) throw APIError.ForbiddenError();
        const group = await Group.findById(imageAlbum.groupId);
        const uploadFilesLevel = group.policies.canUploadFiles;
        let check = checkPrivileges(group, uploader, uploadFilesLevel);
        if(!check) throw APIError.ForbiddenError();
    }
    const _id = new mongoose.Types.ObjectId();
    console.log('name: ', name, ' imagefile: ', imagefile, ' album: ', album, ' uploader: ', uploader);
    const image = await Imagefile.create({_id, name, imagefile, album: new mongoose.Types.ObjectId(album), uploader: new mongoose.Types.ObjectId(uploader)});
    await imageAlbum.updateOne({$push: {images: _id}, lastImage: _id});
    return image;
}


exports.getAllImagesService = async (albumId) => {
    const images = await Imagefile.find({album: albumId});
    return images;
}


exports.getImageService = async (imageId) => {
    const image = await Imagefile.findById(imageId).populate('uploader', '_id username email profilePicture');
    return image;
}


exports.modifyImageService = async (imageId, userId, name, album) => {
    const image = await Imagefile.findById(imageId);
    if(image.uploader.toString() !== userId) throw APIError.ForbiddenError();
    const currentAlbum = await ImageAlbum.findById(image.album);
    if(currentAlbum.albumSettings.isGroupLocked) throw APIError.ForbiddenError();
    if(album !== image.album.toString()){
        const newAlbum = await ImageAlbum.findById(album);
        if(currentAlbum.lastImage.toString() === imageId){
            if(currentAlbum.images.length > 1){
                const imageList = currentAlbum.images;
                await currentAlbum.updateOne({lastImage: imageList[imageList.length-2]});
            }else{
                await currentAlbum.updateOne({lastImage: null});
            }
            await newAlbum.updateOne({lastImage: imageId});
        }
        await currentAlbum.updateOne({$pull: {images: imageId}});
        await newAlbum.updateOne({$push: {images: imageId}});
    }
    await image.updateOne({name, album});
    const updatedImage = await Imagefile.findById(imageId).populate('uploader', '_id username email profilePicture');
    return updatedImage;
}


exports.deleteImageService = async (imageId, userId) => {
    const image = await Imagefile.findById(imageId);
    if(image.uploader.toString() !== userId) throw APIError.ForbiddenError();
    const album = await ImageAlbum.findById(image.album);
    if(album.albumSettings.isGroupLocked) throw APIError.ForbiddenError();
    if(album.lastImage.toString() === imageId){
        if(album.images.length > 1){
            const imageList = album.images;
            await album.updateOne({lastImage: imageList[imageList.length-2]});
        }else{
            await album.updateOne({lastImage: null});
        }
    }
    await album.updateOne({$pull: {images: mongoose.Types.ObjectId(imageId)}});
    await image.deleteOne();
    return;
}