const AudiofileService = require('../services/Audiofile.service');


exports.create = async (req, res, next) => {
    try {
        const {name, artist, groupId, audiofile, uploader} = req.body;
        const newAudio = await AudiofileService.createAudiofileService(name, artist, groupId, audiofile, uploader);
        res.status(201).json({audiofile: newAudio, message: 'File saved successfully'});
    } catch (e) {
        next(e);
    }
}


exports.getAll = async (req, res, next) => {
    try {
        const {page = 1} = req.query;
        const {music, totalPages, more} = await AudiofileService.getAllAudiofilesService(page);
        res.status(200).json({music, page, totalPages, more, message: 'Files fetched successfully'});
    } catch (e) {
        next(e);
    }
}


exports.getGroupAudio = async (req, res, next) => {
    try {
        const groupId = req.params.groupId;
        const {page = 1} = req.query;
        const {music, totalPages, more} = await AudiofileService.getGroupAudioService(groupId, page);
        res.status(200).json({ music, page, totalPages, more, message: 'Files fetched successfully' });
    } catch (e) {
        next(e);
    }
}


exports.addRemoveAudioToGroup = async (req, res, next) => {
    try {
        const groupId = req.params.groupId;
        const {audioId, userId} = req.body;
        const {audio, isAdded} = await AudiofileService.addRemoveAudioToGroupService(audioId, groupId, userId);
        res.status(200).json({ audio, isAdded, message: `Audio ${isAdded ? 'added' : 'removed'} successfully` });
    } catch (e) {
        next(e);
    }
}


exports.getUploadedByUser = async (req, res, next) => {
    try {
        const userId = req.params.userId;
        const {page = 1} = req.query;
        const {music, totalPages, more} = await AudiofileService.getAudiofilesUploadedByUserService(userId, page);
        res.status(200).json({music, page, totalPages, more, message: 'Files fetched successfully'});
    } catch (e) {
        next(e);
    }
}


exports.getSingle = async (req, res, next) => {
    try {
        const audioId = req.params.audioId;
        const audiofile = await AudiofileService.getSingleAudioService(audioId);
        res.status(200).json({ audiofile, message: 'File fetched successfully' });
    } catch (e) {
        next(e);
    }
}


exports.getSpecific = async (req, res, next) => {
    try {
        const search = req.body.search;
        const {page = 1} = req.query;
        const {music, totalPages, more} = await AudiofileService.getSpecificAudiofilesService(search, page);
        res.status(200).json({music, page, totalPages, more, message: 'Files fetched successfully'});
    } catch (e) {
        next(e);
    }
}


exports.setFavorite = async (req, res, next) => {
    try {
        const fileId = req.params.id;
        const { userId } = req.body.userId;
        const favoriteSet = await AudiofileService.setFavoriteAudiofileService(fileId, userId);
        res.status(200).json({message: `Favorite ${favoriteSet ? 'set' : 'unset'}`});
    } catch (e) {
        next(e);
    }
}


exports.delete = async (req, res, next) => {
    try {
        const fileId = req.params.id;
        const { userId } = req.body;
        await AudiofileService.deleteAudiofileService(fileId, userId);
        res.status(200).json({message: 'File deleted successfully'});
    } catch (e) {
        next(e);
    }
}