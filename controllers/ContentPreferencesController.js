const mongoose = require('mongoose');
const ContentPreferences = require('../models/ContentPreferences');
const PreferencesService = require('../services/ContentPreferences.service');


exports.get = async (req, res) => {
    try {
        const userId = req.params.userId;
        const preferences = await ContentPreferences.findOne({user: new mongoose.Types.ObjectId(userId)}).populate('user', '_id email username profilePicture').populate('audioFavorites').populate('videoFavorites');
        res.status(200).json({preferences, message: 'Preferences fetched successfully'});
    } catch (e) {
        res.status(500).json(e);
    }
}


exports.getFavoriteMusic = async (req, res, next) => {
    try {
        const userId = req.params.userId;
        const {page = 1} = req.query;
        const {music, totalPages, more} = await PreferencesService.getFavoriteMusicService(userId, page);
        res.status(200).json({music, page, totalPages, more, message: 'Favorite music fetched successfully'});
    } catch (e) {
        next(e);
    }
}


exports.getFavoriteVideo = async (req, res, next) => {
    try {
        const userId = req.params.userId;
        const {page = 1} = req.query;
        const {videos, totalPages, more} = await PreferencesService.getFavoriteVideoService(userId, page);
        res.status(200).json({videos, page, totalPages, more, message: 'Favorite music fetched successfully'});
    } catch (e) {
        next(e);
    }
}


exports.changeAudioFavorites = async (req, res) => {
    try {
        const userId = req.params.userId;
        const audioId = req.body.audioId;
        const preferences = await ContentPreferences.find({user: mongoose.Types.ObjectId(userId)});
        if(!preferences.audioFavorites.contains(mongoose.Types.ObjectId(audioId))){
            await preferences.updateOne({$pull:{audioFavorites: mongoose.Types.ObjectId(audioId)}});
        } else {
            await preferences.updateOne({$push:{audioFavorites: mongoose.Types.ObjectId(audioId)}});
        }
        res.status(200).json({preferences, message: 'Preferences updated successfully'});
    } catch (e) {
        res.status(500).json(e);
    }
}


exports.changeVideoFavorites = async (req, res) => {
    try {
        const userId = req.params.userId;
        const videoId = req.body.videoId;
        const preferences = await ContentPreferences.find({user: new mongoose.Types.ObjectId(userId)});
        if(!preferences.videoFavorites.contains(new mongoose.Types.ObjectId(videoId))){
            await preferences.updateOne({$pull:{videoFavorites: new mongoose.Types.ObjectId(videoId)}});
        } else {
            await preferences.updateOne({$push:{videoFavorites: new mongoose.Types.ObjectId(videoId)}});
        }
        res.status(200).json({preferences, message: 'Preferences updated successfully'});
    } catch (e) {
        res.status(500).json(e);
    }
}


exports.updateSearchHistory = async (req, res) => {
    try {
        const userId = req.params.userId;
        const {search} = req.body.search;
        const preferences = await ContentPreferences.findOne({user: mongoose.Types.ObjectId(userId)});
        let searchHistory = preferences.videoSearchHistory;
        if (!searchHistory.includes(search) && search !== ''){
            if (searchHistory.length < 50){
                searchHistory = [search, ...searchHistory];
            } else {
                searchHistory.pop();
                searchHistory = [search, ...searchHistory];
           }
        }
        await preferences.updateOne({videoSearchHistory: searchHistory});
        res.status(200).json({preferences, message: 'Preferences updated successfully'});
    } catch (e) {
        res.status(500).json(e);
    }
}


exports.updateVideoTags = async (req, res) => {
    try {
        const userId = req.params.userId;
        const tags = req.body.tags;
        const preferences = await ContentPreferences.find({user: new mongoose.Types.ObjectId(userId)});
        const videoTags = preferences.videoTags;
        for (let tag of tags){
            if (!videoTags.contains(search)){
                if (videoTags.length < 100) videoTags = [tag, ...videoTags];
                else {
                    videoTags.pop();
                    videoTags = [tag, ...videoTags];
               }
            }
        }
        await preferences.updateOne({videoTags: videoTags});
        res.status(200).json({preferences, message: 'Preferences updated successfully'});
    } catch (e) {
        res.status(500).json(e);
    }
}


exports.clearAudioFavorites = async (req, res) => {
    try {
        const userId = req.params.userId;
        const preferences = await ContentPreferences.findOneAndUpdate({user: new mongoose.Types.ObjectId(userId)}, {audioFavorites: []});
        res.status(200).json({preferences, message: 'Preferences updated successfully'});
    } catch (e) {
        res.status(500).json(e);
    }
}


exports.clearVideoFavorites = async (req, res) => {
    try {
        const userId = req.params.userId;
        const preferences = await ContentPreferences.findOneAndUpdate({user: new mongoose.Types.ObjectId(userId)}, {videoFavorites: []});
        res.status(200).json({preferences, message: 'Preferences updated successfully'});
    } catch (e) {
        res.status(500).json(e);
    }
}


exports.clearVideoRecommendations = async (req, res) => {
    try {
        const userId = req.params.userId;
        const preferences = await ContentPreferences.findOneAndUpdate({user: new mongoose.Types.ObjectId(userId)}, {videoSearchHistory: [], videoTags: []});
        res.status(200).json({preferences, message: 'Preferences updated successfully'});
    } catch (e) {
        res.status(500).json(e);
    }
}