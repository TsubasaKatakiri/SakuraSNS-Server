const mongoose = require('mongoose');

const ImagefileSchema = new mongoose.Schema({
    name: { type: String },
    imagefile: { type: String, required: true },
    album: { type: mongoose.Schema.Types.ObjectId, ref: 'Album' },
    uploader: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
    comments: { type: Array, default: [] },
}, {
    timestamps: true,
});

module.exports = mongoose.model('Imagefile', ImagefileSchema);