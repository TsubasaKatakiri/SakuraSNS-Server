const FileService = require('../services/File.service');


exports.create = async (req, res, next) => {
    console.log(req.body);
    try {
        const {name, file, type, uploader} = req.body;
        const newFile = await FileService.createFileService(name, file, type, uploader);
        res.status(201).json({file: newFile, message: 'File saved successfully'});
    } catch (e) {
        next(e);
    }
}


exports.get = async (req, res, next) => {
    try {
        const fileId = req.params.id
        const file = await FileService.getFileService(fileId);
        res.status(200).json({file, message: 'File fetched successfully'});
    } catch (e) {
        next(e);
    }
}


exports.delete = async (req, res, next) => {
    try {
        const fileId = req.params.id;
        const { userId } = req.body;
        await FileService.deleteFileService(fileId, userId);
        res.status(200).json({message: 'File deleted successfully'});
    } catch (e) {
        next(e);
    }
}