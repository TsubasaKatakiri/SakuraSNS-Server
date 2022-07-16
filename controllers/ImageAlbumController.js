const ImageAlbumService = require('../services/ImageAlbum.service');


exports.create = async (req, res, next) => {
    try {
        const {name, owner, groupId} = req.body;
        const album = await ImageAlbumService.createAlbumService(name, owner, groupId);
        res.status(201).json({album, message: 'Album created successfully'});
    } catch (e) {
        next(e);
    }
}


exports.getAll = async (req, res, next) => {
    try {
        const ownerId = req.params.user;
        const albums = await ImageAlbumService.getAllAlbumsService(ownerId);
        res.status(200).json({albums, message: 'Albums fetched successfully'});
    } catch (e) {
        next(e);
    }
}


exports.getAllOfGroup = async (req, res, next) => {
    try {
        const groupId = req.params.groupId;
        const albums = await ImageAlbumService.getAllGroupAlbumsService(groupId);
        res.status(200).json({albums, message: 'Albums fetched successfully'});
    } catch (e) {
        next(e);
    }
}


exports.get = async (req, res, next) => {
    try {
        const albumId = req.params.id;
        const album = await ImageAlbumService.getAlbumService(albumId)
        res.status(200).json({album, message: 'Album fetched successfully'});
    } catch (e) {
        next(e);
    }
}


exports.getOneOfGroup = async (req, res, next) => {
    try {
        const albumId = req.params.albumId;
        const {groupId, userId} = req.body;
        const album = await ImageAlbumService.getOneOfGroupService(albumId, groupId, userId)
        res.status(200).json({album, message: 'Album fetched successfully'});
    } catch (e) {
        next(e);
    }
}


exports.update = async (req, res, next) => {
    try {
        const albumId = req.params.id;
        const {owner, name} = req.body;
        const album = await ImageAlbumService.updateAlbumService(albumId, owner, name);
        res.status(200).json({album, message: 'Album updated successfully'});
    } catch (e) {
        next(e);
    }
}


exports.lock = async (req, res, next) => {
    try {
        const albumId = req.params.id;
        const {userId} = req.body;
        const isLocked = await ImageAlbumService.lockGroupAlbumService(albumId, userId);
        res.status(200).json({isLocked, message: `Album ${isLocked ? 'locked' : 'unlocked'} successfully`});
    } catch (e) {
        next(e);
    }
}


exports.private = async (req, res, next) => {
    try {
        const albumId = req.params.id;
        const {userId} = req.body;
        const isPrivate = await ImageAlbumService.privateGroupAlbumService(albumId, userId);
        res.status(200).json({isPrivate, message: `Album  ${isPrivate ? 'made private' : 'made public'} successfully`});
    } catch (e) {
        next(e);
    }
}


exports.deletePreserve = async (req, res, next) => {
    try {
        const albumId = req.params.albumId;
        const userId = req.body.userId;
        await ImageAlbumService.deletePreserveAlbumService(albumId, userId);
        res.status(200).json({message: 'Album deleted successfully'});
    } catch (e) {
        next(e);
    }
}


exports.deleteFull = async (req, res, next) => {
    try {
        const albumId = req.params.albumId;
        const userId = req.body.userId;
        await ImageAlbumService.deleteFullAlbumService(albumId, userId);
        res.status(200).json({message: 'Album deleted successfully'});
    } catch (e) {
        next(e);
    }
}