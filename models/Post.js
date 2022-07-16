const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    group: { type: mongoose.Schema.Types.ObjectId, ref: 'Group' },
    text: { type: String, max: 4096 },
    attachments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'File' }],
    location: { type: String, default: '' },
    tags: { type: Array, default: [] },
    likes: { type: Array, default: [] },
    dislikes: { type: Array, default: [] },
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }],
}, {
    timestamps: true
});

module.exports=mongoose.model('Post', PostSchema);