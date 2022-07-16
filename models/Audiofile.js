const mongoose = require('mongoose');

const AudiofileSchema = new mongoose.Schema({
    name: { type: String, required: true },
    artist: { type: String, required: true },
    audiofile: { type: String, required: true },
    favorite: [ {type: mongoose.Schema.Types.ObjectId, ref: 'User'} ],
    groups: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Group' }],
    uploader: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
    groupId: { type: mongoose.Schema.Types.ObjectId, ref: 'Group' },
}, {
    timestamps: true,
});

module.exports = mongoose.model('Audiofile', AudiofileSchema);