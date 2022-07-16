const mongoose = require('mongoose');

const VideofileSchema = new mongoose.Schema({
    name: { type: String, required: true },
    videofile: { type: String, required: true },
    description: { type: String },
    uploader: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
    tags: { type: Array, default: [] },
    favorite: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    groups: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Group' }],
    views: { type: Number, default: 0 },
    likes: { type: Array, default: [] },
    dislikes: { type: Array, default: [] },
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }],
}, {
    timestamps: true,
});

module.exports = mongoose.model('Videofile', VideofileSchema);