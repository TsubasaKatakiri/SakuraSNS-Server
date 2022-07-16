const mongoose = require('mongoose');
const APIError = require('../middleware/apiErrors.middleware');
const File = require('../models/File');


exports.createFileService = async (name, file, type, uploader) => {
    const _id = new mongoose.Types.ObjectId();
    const newFile = await File.create({_id, name, file, type, uploader: mongoose.Types.ObjectId(uploader)});
    return newFile;
}


exports.getFileService = async (fileId) => {
    const file = await File.findById(fileId);
    return file;
}


exports.deleteFileService = async (fileId, userId) => {
    const file = await File.findById(fileId);
    if(file.uploader.toString() !== userId) throw APIError.ForbiddenError();
    await file.deleteOne();
    return;
}
