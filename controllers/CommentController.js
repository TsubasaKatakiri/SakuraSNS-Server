const CommentService = require ('../services/Comment.service.js');


exports.create = async (req, res, next) => {
    try {
        const {entryId, userId, text} = req.body;
        const comment = await CommentService.createCommentService(entryId, userId, text);
        res.status(201).json({comment: comment, message: 'Comment created successfully'});
    } catch (e) {
        next(e);
    }
}


exports.update = async (req, res, next) => {
    try {
        const commentId = req.params.commentId;
        const commentInfo = req.body;
        const comment = await CommentService.updateCommentService(commentId, commentInfo);
        res.status(200).json({comment, message: 'Comment updated successfully'});
    } catch (e) {
        next(e);
    }
}


exports.delete = async (req, res, next) => {
    try {
        const commentId = req.params.commentId;
        const commentInfo = req.body;
        await CommentService.deleteCommentService(commentId, commentInfo)
        res.status(200).json({message: 'Post deleted successfully'});
    } catch (e) {
        next(e);
    }
}


exports.getAll = async (req, res, next) => {
    try {
        const entryId = req.params.entryId;
        const comments = await CommentService.getAllCommentsService(entryId);
        res.status(200).json({comments, message: 'Comments fetched successfully'});
    } catch (e) {
        next(e);
    }
}


exports.like = async (req, res, next) => {
    try {
        const commentId = req.params.commentId;
        const userId = req.body.userId;
        const isLiked = await CommentService.likeCommentService(commentId, userId);
        res.status(200).json({message: `Comment ${isLiked ? 'liked' : 'unliked'}`});
    } catch (e) {
        next(e);
    }
}


exports.dislike = async (req, res, next) => {
    try {
        const commentId = req.params.commentId;
        const userId = req.body.userId;
        const isDisliked = await CommentService.dislikeCommentService(commentId, userId);
        res.status(200).json({message: `Comment ${isDisliked ? 'liked' : 'unliked'}`});
    } catch (e) {
        next(e);
    }
}