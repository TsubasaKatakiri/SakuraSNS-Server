const VideofileService = require('../services/Videofile.service');


exports.create = async (req, res, next) => {
    try {
        const { name, videofile, groupId, description, uploader, tags } = req.body;
        const video = await VideofileService.createVideoService(name, videofile, groupId, description, uploader, tags)
        res.status(201).json({ videofile: video, message: 'File saved successfully' });
    } catch (e) {
        next(e);
    }
}


exports.getAll = async (req, res, next) => {
    try {
        const {page = 1} = req.query;
        const {videos, totalPages, more} = await VideofileService.getAllVideoService(page);
        res.status(200).json({ videos, page, totalPages, more, message: 'Files fetched successfully' });
    } catch (e) {
        next(e);
    }
}


exports.getGroupVideos = async (req, res, next) => {
    try {
        const groupId = req.params.groupId;
        const {page = 1} = req.query;
        const {videos, totalPages, more} = await VideofileService.getGroupVideoService(groupId, page);
        res.status(200).json({ videos, page, totalPages, more, message: 'Files fetched successfully' });
    } catch (e) {
        next(e);
    }
}


exports.addRemoveVideoToGroup = async (req, res, next) => {
    try {
        const groupId = req.params.groupId;
        const {videoId, userId} = req.body;
        const {video, isAdded} = await VideofileService.addRemoveVideoToGroupService(videoId, groupId, userId);
        res.status(200).json({ video, isAdded, message: `Video ${isAdded ? 'added' : 'removed'} successfully` });
    } catch (e) {
        next(e);
    }
}


exports.getUploadedByUser = async (req, res, next) => {
    try {
        const userId = req.params.userId;
        const {page = 1} = req.query;
        const {videos, totalPages, more} = await VideofileService.getVideoUploadedByUserService(userId, page);
        res.status(200).json({ videos, page, totalPages, more, message: 'Files fetched successfully' });
    } catch (e) {
        next(e);
    }
}


exports.get = async (req, res, next) => {
    try {
        const videoId = req.params.id;
        const videofile = await VideofileService.getSingleVideoService(videoId);
        res.status(200).json({ videofile, message: 'File fetched successfully' });
    } catch (e) {
        next(e);
    }
}


exports.getSpecific = async (req, res, next) => {
    try {
        const search = req.body.search;
        const {page = 1} = req.query;
        const {videos, totalPages, more} = await VideofileService.getSpecificVideoService(search, page);
        res.status(200).json({ videos, page, totalPages, more, message: 'Files fetched successfully' });
    } catch (e) {
        next(e);
    }
}


exports.getVideosByTag = async (req, res, next) => {
    try {
        const tag = req.body.tag;
        const {page = 1} = req.query;
        const {videos, totalPages, more} = await VideofileService.getVideosByTagService(tag, page);
        res.status(200).json({ videos, page, totalPages, more, message: 'Files fetched successfully' });
    } catch (e) {
        next(e);
    }
}


exports.edit = async (req, res, next) => {
    try {
        const videoId = req.params.id;
        const videoData = req.body;
        const videofile = await VideofileService.editVideoService(videoId, videoData);
        res.status(200).json({ videofile, message: 'Videofile updated successfully' });
    } catch (e) {
        next(e);
    }
}


exports.delete = async (req, res, next) => {
    try {
        const videoId = req.params.id;
        const userId = req.body.userId;
        await VideofileService.deleteVideoService(videoId, userId);
        res.status(200).json({ message: 'Videofile deleted successfully' });
    } catch (e) {
        next(e);
    }
}


exports.like = async (req, res, next) => {
    try {
        const videoId = req.params.id;
        const userId = req.body.userId;
        const isLiked = await VideofileService.likeVideoService(videoId, userId);
        res.status(200).json({ message: `Video ${ !isLiked ? 'un': '' }liked` });
    } catch (e) {
        next(e);
    }
}


exports.dislike = async (req, res, next) => {
    try {
        const videoId = req.params.id;
        const userId = req.body.userId;
        const isDisliked = await VideofileService.dislikeVideoService(videoId, userId);
        res.status(200).json({ message: `Video ${ !isDisliked ? 'un': '' }disliked` });
    } catch (e) {
        next(e);
    }
}


exports.setFavorite = async (req, res, next) => {
    try {
        const fileId = req.params.id;
        const { userId } = req.body;
        const favoriteSet = await VideofileService.setFavoriteVideoService(fileId, userId);
        res.status(200).json({ message: `Favorite ${ favoriteSet ? 'set' : 'unset' }` });
    } catch (e) {
        next(e);
    }
}