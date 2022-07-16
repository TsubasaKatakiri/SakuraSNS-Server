const mongoose = require('mongoose');
const APIError = require('../middleware/apiErrors.middleware');
const Comment = require('../models/Comment');
const Post = require('../models/Post');

exports.createCommentService = async (entryId, userId, text) => {
    const _id = new mongoose.Types.ObjectId();
    await Comment.create({_id, entryId, user: userId, text});
    await Post.findByIdAndUpdate(entryId, {$push: {comments: _id}});
    const comment = await Comment.findById(_id).populate('user', '_id email username profilePicture');
    return comment;
}


exports.updateCommentService = async (id, commentInfo) => {
    const comment = await Comment.findById(id);
    if(comment.user.toString() !== commentInfo.userId) throw APIError.ForbiddenError();
    await comment.updateOne({text: commentInfo.text});
    const commentUpdated = await Comment.findById(id).populate('user', '_id email username profilePicture');
    return commentUpdated;
}


exports.deleteCommentService = async (id, commentInfo) => {
    const comment = await Comment.findById(id);
    if(comment.user.toString() !== commentInfo.userId) throw APIError.ForbiddenError();
    await Post.findByIdAndUpdate(comment.entryId, {$pull: {comments: id}});
    await comment.deleteOne();
    return;
}


exports.getAllCommentsService = async (entryId, limit, page) => {
    const comments = await Comment.find({entryId}).sort({createdAt: 'desc'}).populate('user', '_id email username profilePicture');
    return comments;
}


exports.likeCommentService = async (commentId, userId) => {
    const comment = await Comment.findById(commentId);
    if(comment.dislikes.includes(userId)) {
        await comment.updateOne({$pull: {dislikes: userId}});
    };
    if(!comment.likes.includes(userId)) {
        await comment.updateOne({$push: {likes: userId}});
        return true;
    }else{
        await comment.updateOne({$pull: {likes: userId}});
        return false
    }
}


exports.dislikeCommentService = async (commentId, userId) => {
    const comment = await Comment.findById(commentId);
    if(comment.likes.includes(userId)) {
        await comment.updateOne({$pull: {likes: userId}});
    };
    if(!comment.dislikes.includes(userId)) {
        await comment.updateOne({$push: {dislikes: userId}});
        return true;
    }else{
        await comment.updateOne({$pull: {dislikes: userId}});
        return false;
    }
}