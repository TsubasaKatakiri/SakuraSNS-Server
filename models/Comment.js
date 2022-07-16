const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema({
        entryId: {type: String, required: true},
        user: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
        text: {type: String, max: 4096},
        likes: {type: Array, default: []},
        dislikes: {type: Array, default: []},
}, {
    timestamps: true
});

module.exports=mongoose.model('Comment', CommentSchema);