const ImageService = require('../services/Image.service');


exports.create = async (req, res, next) => {
    try {
        const {name, imagefile, album, uploader} = req.body;
        const image = await ImageService.createImageService(name, imagefile, album, uploader);
        res.status(201).json({image, message: 'File saved successfully'});
    } catch (e) {
        next(e);
    }
}


exports.getAll = async (req, res, next) => {
    try {
        const albumId = req.params.albumId;
        const images = await ImageService.getAllImagesService(albumId);
        res.status(200).json({images, message: 'Files fetched successfully'});
    } catch (e) {
        next(e);
    }
}


exports.get = async (req, res, next) => {
    try {
        const imageId = req.params.id;
        const image = await ImageService.getImageService(imageId);
        res.status(200).json({image, message: 'Files fetched successfully'});
    } catch (e) {
        next(e);
    }
}


exports.modify = async (req, res, next) => {
    try {
        const imageId = req.params.id;
        const {name, album, userId} = req.body;
        const image = await ImageService.modifyImageService(imageId, userId, name, album);
        res.status(200).json({image, message: 'File updated successfully'});
    } catch (e) {
        next(e);
    }
}


exports.deleteImage = async (req, res, next) => {
    try {
        const imageId = req.params.id;
        const { userId } = req.body;
        console.log(userId);
        await ImageService.deleteImageService(imageId, userId);
        res.status(200).json({message: 'File deleted successfully'});
    } catch (e) {
        next(e);
    }
}