const mongoose = require('mongoose');

const ContentPreferencesSchema = new mongoose.Schema({
    _id: { type: mongoose.Schema.Types.ObjectId, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    audioFavorites: [ {type: mongoose.Schema.Types.ObjectId, ref: 'Audiofile'} ],
    videoFavorites: [ {type: mongoose.Schema.Types.ObjectId, ref: 'Videofile'} ],
    videoSearchHistory: { type: Array, default: [] },
    videoTags: { type: Array, default: [] },
}, {
    timestamps: true,
});

module.exports = mongoose.model('ContentPreferences', ContentPreferencesSchema);