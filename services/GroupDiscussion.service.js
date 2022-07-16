const mongoose = require ('mongoose');
const APIError = require('../middleware/apiErrors.middleware');
const Group = require('../models/Group');
const GroupDiscussion = require('../models/GroupDiscussion');
const DiscussionPost = require ('../models/DiscussionPost');
const checkPrivileges = require('../util/checkGroupUserPrivileges');


exports.createGroupDiscussionService = async (groupId, discussionName, isPrivate, userId, postText) => {
    const discussionId = new mongoose.Types.ObjectId();
    const postId = new mongoose.Types.ObjectId();
    const group = await Group.findById(groupId);
    const createDiscussionsLevel = group.policies.canCreateDiscussions;
    const check = checkPrivileges(group, userId, createDiscussionsLevel);
    if(!check) throw APIError.ForbiddenError();
    const discussion = await GroupDiscussion.create({_id: discussionId, groupId: mongoose.Types.ObjectId(groupId), discussionName, isPrivate, author: userId});
    const post = await DiscussionPost.create({_id: postId, discussionId, author: userId, postText});
    await discussion.updateOne({$push: {posts: post}, lastPost: post});
    await group.updateOne({$push: {groupDiscussions: discussionId}});
    const newDiscussion = await GroupDiscussion.findById(discussionId).populate('lastPost').populate('author', '_id username email profilePicture');
    return newDiscussion;
}

exports.getGroupDiscussionService = async(discussionId, groupId, userId) => {
    const group = await Group.findById(groupId);
    const discussion = await GroupDiscussion.findById(discussionId).populate('lastPost').populate('author', '_id username email profilePicture');
    if(discussion.isPrivate === true && !group.members.includes(userId)) throw APIError.ForbiddenError();
    return discussion;
}

exports.getAllGroupDiscussionsService = async(groupId) => {
    const discussions = await GroupDiscussion.find({groupId}).populate('lastPost').populate('author', '_id username email profilePicture');
    return discussions;
}

exports.closeGroupDiscussionService = async (groupId, discussionId, userId) => {
    const group = await Group.findById(groupId);
    const deleteDiscussionsLevel = group.policies.canDeleteDiscussions;
    let check = checkPrivileges(group, userId, deleteDiscussionsLevel);
    if(!check) throw APIError.ForbiddenError();
    const discussion = await GroupDiscussion.findById(discussionId);
    if(discussion.isClosed === false){
        await discussion.updateOne({isClosed: true});
        return true;
    } else {
        await discussion.updateOne({isClosed: false});
        return false;
    }
}

exports.hideGroupDiscussionService = async (groupId, discussionId, userId) => {
    const group = await Group.findById(groupId);
    const deleteDiscussionsLevel = group.policies.canDeleteDiscussions;
    let check = checkPrivileges(group, userId, deleteDiscussionsLevel);
    if(!check) throw APIError.ForbiddenError();
    const discussion = await GroupDiscussion.findById(discussionId);
    if(discussion.isPrivate === false){
        await discussion.updateOne({isPrivate: true});
        return true;
    } else {
        await discussion.updateOne({isPrivate: false});
        return false;
    }
}

exports.deleteGroupDiscussionService = async (groupId, discussionId, userId) => {
    const group = await Group.findById(groupId);
    const deleteDiscussionsLevel = group.policies.canDeleteDiscussions;
    let check = checkPrivileges(group, userId, deleteDiscussionsLevel);
    if(!check) throw APIError.ForbiddenError();
    const discussion = await GroupDiscussion.findById(discussionId);
    await discussion.deleteOne();
    return;
}

exports.createGroupDiscussionPostService = async (discussionId, userId, postText) => {
    const discussion = await GroupDiscussion.findById(discussionId);
    if(discussion.isClosed === true) throw APIError.ForbiddenError();
    const postId = new mongoose.Types.ObjectId();
    await DiscussionPost.create({_id: postId, discussionId, author: userId, postText});
    await discussion.updateOne({$push: {posts: postId}, lastPost: postId});
    const post = await DiscussionPost.findById(postId).populate('author', '_id username email profilePicture')
    return post;
}

exports.getGroupDiscussionPostsService = async (limit, page, discussionId, groupId, userId) => {
        const discussion = await GroupDiscussion.findById(discussionId);
        const group = await Group.findById(groupId);
        if(discussion.isPrivate === true && !group.members.includes(userId)) throw APIError.ForbiddenError();
        const totalPosts = await DiscussionPost.find({discussionId}).count();
        const posts = await DiscussionPost.find({discussionId}).limit(limit).skip(limit * (page - 1)).populate('author', '_id username email profilePicture');
        const totalPages = Math.ceil(totalPosts / limit);
        const more = page * limit < totalPosts;
        return { posts, totalPages, more };
}

exports.deleteGroupDiscussionPostService = async (groupId, discussionId, postId, userId) => {
    const discussion = await GroupDiscussion.findById(discussionId);
    if(discussion.isClosed === true) throw APIError.ForbiddenError();
    const post = await DiscussionPost.findById(postId);
    const group = await Group.findById(groupId);
    const deleteDiscussionsLevel = group.policies.canDeleteDiscussions;
    let check = checkPrivileges(group, userId, deleteDiscussionsLevel);
    if(!check || post.author.toString() !== userId) throw APIError.ForbiddenError();
    await discussion.updateOne({$pull: {posts: postId}});
    await post.deleteOne();
    if(discussion.lastPost.toString() === postId){
        const posts = await DiscussionPost.find({discussionId}).sort({createdAt: 'desc'});
        const newLastPost = posts[0];
        await discussion.updateOne({lastPost: newLastPost._id});
    }
    return;
}