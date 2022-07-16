const mongoose = require('mongoose');

const GroupInfoBlockSchema = new mongoose.Schema({
    groupId: { type: mongoose.Schema.Types.ObjectId, ref: 'Group' },
    infoBlockHeader: { type: String, default: '' },
    infoBlockText: { type: String, default: '' },
    infoBlockImages: [{ type: mongoose.Schema.Types.ObjectId, ref: 'File' }],
}, {
    timestamps: true,
})

module.exports = mongoose.model('GroupInfoBlock', GroupInfoBlockSchema);