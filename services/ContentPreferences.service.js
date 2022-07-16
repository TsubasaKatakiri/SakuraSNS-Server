const mongoose = require("mongoose");
const APIError = require('../middleware/apiErrors.middleware');
const Audiofile = require('../models/Audiofile');
const Videofile = require('../models/Videofile');


exports.getFavoriteMusicService = async (userId, page) => {
    const limit = 25;
    const musicNumber = await Audiofile.find({favorite: {$in: mongoose.Types.ObjectId(userId)}}).count();
    const music = await Audiofile.find({favorite: {$in: mongoose.Types.ObjectId(userId)}}).sort({createdAt: 'desc'}).limit(limit).skip((page - 1) * limit);
    const totalPages = Math.ceil(musicNumber / limit);
    const more = page * limit < musicNumber;
    return {music, totalPages, more};
}

exports.getFavoriteVideoService = async (userId, page) => {
    const limit = 24;
    const videosNumber = await Videofile.find({favorite: {$in: mongoose.Types.ObjectId(userId)}}).count();
    const videos = await Videofile.find({favorite: {$in: mongoose.Types.ObjectId(userId)}}).sort({createdAt: 'desc'}).limit(limit).skip((page - 1) * limit).populate('uploader', '_id email username profilePicture');
    const totalPages = Math.ceil(videosNumber / limit);
    const more = page * limit < videosNumber;
    return {videos, totalPages, more};
}