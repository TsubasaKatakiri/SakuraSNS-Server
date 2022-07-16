const mongoose = require('mongoose');

const GroupDiscussionSchema = new mongoose.Schema({
    groupId: { type: mongoose.Schema.Types.ObjectId, ref: 'Group' },
    discussionName: { type: String, default: '' },
    isPrivate: { type: Boolean, default: false },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    posts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'DiscussionPost' }],
    lastPost: { type: mongoose.Schema.Types.ObjectId, ref: 'DiscussionPost' },
    isClosed: { type: Boolean, default: false },
}, {
    timestamps: true,
});

module.exports = mongoose.model('GroupDiscussion', GroupDiscussionSchema);