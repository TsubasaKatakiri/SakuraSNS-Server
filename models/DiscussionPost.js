const mongoose = require('mongoose');

const DiscussionPostSchema = new mongoose.Schema({
    discussionId: { type: mongoose.Schema.Types.ObjectId, ref: 'GroupDiscussion' },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    postText: { type: String, default: '' },
}, {
    timestamps: true,
})

module.exports = mongoose.model('DiscussionPost', DiscussionPostSchema);