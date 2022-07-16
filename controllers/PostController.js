const PostService = require ('../services/Post.service');


exports.create = async (req, res, next) => {
    try {
        const {userId, text, groupId, attachments, location, tags} = req.body;
        const post = await PostService.createPostService(userId, text, groupId, attachments, location, tags);
        res.status(201).json({post: post, message: 'Post created successfully'});
    } catch (e) {
        next(e);
    }
}


exports.update = async (req, res, next) => {
    try {
        const postId = req.params.postId;
        const postInfo = req.body;
        const post = await PostService.updatePostService(postId, postInfo);
        res.status(200).json({post: post, message: 'Post updated successfully'});
    } catch (e) {
        next(e);
    }
}


exports.delete = async (req, res, next) => {
    try {
        const postId = req.params.postId;
        const postInfo = req.body;
        await PostService.deletePostService(postId, postInfo)
        res.status(200).json({message: 'Post deleted successfully'});
    } catch (e) {
        next(e);
    }
}


exports.like = async (req, res, next) => {
    try {
        const postId = req.params.postId;
        const userId = req.body.userId;
        const isLiked = await PostService.likePostService(postId, userId);
        res.status(200).json({message: `Post ${isLiked ? 'liked' : 'unliked'}`});
    } catch (e) {
        next(e);
    }
}


exports.dislike = async (req, res, next) => {
    try {
        const postId = req.params.postId;
        const userId = req.body.userId;
        const isDisliked = await PostService.dislikePostService(postId, userId);
        res.status(200).json({message: `Post ${isDisliked ? 'disliked' : 'undisliked'}`});
    } catch (e) {
        next(e);
    }
}


exports.get = async (req, res, next) => {
    try {
        const post = await PostService.getPostService(req.params.postId);
        res.status(200).json({post, message: 'Post fetched successfully'});
    } catch (e) {
        next(e);
    }
}


exports.getAll = async (req, res, next) => {
    try {
        const userId = req.params.userId;
        const {limit = 10, page = 1} = req.query;
        const values = await PostService.getAllPostsService(userId, limit, page);
        res.status(200).json({posts: values.posts, page: page, limit: limit, totalPosts: values.postNumber, 
            totalPages: values.totalPages, more: values.more, message: 'User posts fetched successfully'});
    } catch (e) {
        next(e);
    }
}


exports.getByTag = async (req, res, next) => {
    try {
        const tag = req.body.tag;
        const {limit = 10, page = 1} = req.query;
        const values = await PostService.getTagPostsService(tag, limit, page);
        res.status(200).json({posts: values.posts, page: page, limit: limit, totalPosts: values.postNumber, 
            totalPages: values.totalPages, more: values.more, message: 'User posts fetched successfully'});
    } catch (e) {
        next(e);
    }
}


exports.getFeed = async (req, res, next) => {
    try {
        const userId = req.params.userId;
        const {limit = 10, page = 1} = req.query;
        const values = await PostService.getFeedPostsService(userId, limit, page);
        res.status(200).json({posts: values.postFeed, page: page, limit: limit, totalPosts: values.postNumber, 
            totalPages: values.totalPages, more: values.more, message: 'Post feed fetched successfully'})
    } catch (e) {
        next(e);
    }
}


exports.getGroupFeed = async (req, res, next) => {
    try {
        const groupId = req.params.groupId;
        const {limit = 10, page = 1} = req.query;
        const values = await PostService.getGroupPostsService(groupId, limit, page);
        res.status(200).json({posts: values.posts, page: page, limit: limit, totalPosts: values.postNumber, 
            totalPages: values.totalPages, more: values.more, message: 'Group posts fetched successfully'});
    } catch (e) {
        next(e);
    }
}