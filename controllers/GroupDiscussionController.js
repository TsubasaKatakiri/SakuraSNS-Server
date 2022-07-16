const GroupDiscussionService = require('../services/GroupDiscussion.service');


exports.createGroupDiscussion = async (req, res, next) => {
    try {
        const { groupId } = req.params;
        const { discussionName, isPrivate, userId, postText } = req.body;
        const discussion = await GroupDiscussionService.createGroupDiscussionService( groupId, discussionName, isPrivate, userId, postText )
        res.status(201).json({ discussion, message: 'Group discussion created successfully' });
    } catch (e) {
        next(e);
    }
}


exports.getGroupDiscussion = async(req, res, next) => {
    try {
        const { discussionId, groupId } = req.params;
        const { userId } = req.body;
        const discussion = await GroupDiscussionService.getGroupDiscussionService(discussionId, groupId, userId)
        res.status(200).json({ discussion, message: 'Group retrieved successfully' });
    } catch (e) {
        next(e);
    }
}


exports.getAllGroupDiscussions = async(req, res, next) => {
    try {
        const { groupId } = req.params;
        const discussions = await GroupDiscussionService.getAllGroupDiscussionsService(groupId);
        res.status(200).json({ discussions, message: 'Group retrieved successfully' });
    } catch (e) {
        next(e);
    }
}


exports.closeGroupDiscussion = async (req, res, next) => {
    try {
        const { groupId, discussionId } = req.params;
        const { userId } = req.body;
        const isClosed = await GroupDiscussionService.closeGroupDiscussionService(groupId, discussionId, userId);
        res.status(200).json({ isClosed, message: `Group discussion ${isClosed ? 'closed' : 'opened'}` });
    } catch (e) {
        next(e);
    }
}


exports.hideGroupDiscussion = async (req, res, next) => {
    try {
        const { groupId, discussionId } = req.params;
        const { userId } = req.body;
        const isPrivate = await GroupDiscussionService.hideGroupDiscussionService(groupId, discussionId, userId);
        res.status(200).json({ isPrivate, message: `Group discussion is now ${isPrivate ? 'private' : 'public'}` });
    } catch (e) {
        next(e);
    }
}


exports.deleteGroupDiscussion = async (req, res, next) => {
    try {
        const { groupId, discussionId } = req.params;
        const { userId } = req.body;
        await GroupDiscussionService.deleteGroupDiscussionService(groupId, discussionId, userId);
        res.status(200).json({ message: 'Group discussion deleted' });
    } catch (e) {
        next(e);
    }
}


exports.createGroupDiscussionPost = async (req, res, next) => {
    try {
        const { discussionId } = req.params;
        const { userId, postText } = req.body;
        const post = await GroupDiscussionService.createGroupDiscussionPostService(discussionId, userId, postText);
        res.status(200).json({ post, message: 'New discussion post created' });
    } catch (e) {
        next(e);
    }
}


exports.getGroupDiscussionPosts = async (req, res, next) => {
    try {
        const {limit = 10, page = 1} = req.query;
        const { discussionId, groupId } = req.params;
        const { userId } = req.body;
        const { posts, totalPages, more } = await GroupDiscussionService.getGroupDiscussionPostsService(limit, page, discussionId, groupId, userId);
        res.status(200).json({ posts, page, limit, totalPages, more, message: 'Discussion posts retrieved' });
    } catch (e) {
        next(e);
    }
}


exports.deleteGroupDiscussionPost = async (req, res, next) => {
    try {
        const { groupId, discussionId, postId } = req.params;
        const { userId } = req.body;
        await GroupDiscussionService.deleteGroupDiscussionPostService(groupId, discussionId, postId, userId);
        res.status(200).json({ message: 'Discussion post deleted' });
    } catch (e) {
        next(e);
    }
}