const mongoose = require('mongoose');

const FileSchema = new mongoose.Schema({
    name: { type: String, required: true },
    file: { type: String, required: true },
    type: { type: String, required: true },
    uploader: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, {
    timestamps: true,
});

module.exports = mongoose.model('File', FileSchema);