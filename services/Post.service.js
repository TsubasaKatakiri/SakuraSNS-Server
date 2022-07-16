const mongoose = require('mongoose');
const APIError = require('../middleware/apiErrors.middleware');
const Post = require('../models/Post');
const User = require ('../models/User');
const Group = require('../models/Group');
const checkPrivileges = require('../util/checkGroupUserPrivileges');


exports.createPostService = async (userId, text, groupId, attachments, location, tags) => {
    const _id = new mongoose.Types.ObjectId();
    const readyAttachments = attachments.map((a) => {
        return mongoose.Types.ObjectId(a);
    })
    if(groupId){
        const group = await Group.findById(groupId);
        const createPostsLevel = group.policies.canCreatePosts;
        const check = checkPrivileges(group, userId, createPostsLevel);
        if(!check) throw APIError.ForbiddenError();
        await group.updateOne({$push: {posts: _id}});
    }
    await Post.create({_id, user: userId, text, attachments: readyAttachments, location, tags});
    if(groupId) await Post.findByIdAndUpdate(_id, {group: groupId});
    const post = await Post.findById(_id).populate('user', '_id email username profilePicture').populate('attachments');
    return post;
}


exports.updatePostService = async (postId, postInfo) => {
    const {text, attachments, location, tags} = postInfo;
    console.log(postInfo);
    const readyAttachments = attachments.map((a) => {
        return mongoose.Types.ObjectId(a);
    })
    const post = await Post.findById(postId);
    console.log(post);
    if(post.user.toString() !== postInfo.userId) throw APIError.ForbiddenError();
    await post.updateOne({text, attachments: readyAttachments, location, tags});
    const postUpdated = await Post.findById(postId).populate('user', '_id email username profilePicture').populate('attachments');
    return postUpdated;
}


exports.deletePostService = async (postId, postInfo) => {
    const post = await Post.findById(postId);
    if(post.user.toString() !== postInfo.userId) throw APIError.ForbiddenError();
    await post.deleteOne();
    return;
}


exports.likePostService = async (postId, userId) => {
    const post = await Post.findById(postId);
    if(post.dislikes.includes(userId)) {
        await post.updateOne({$pull:{dislikes: userId}});
    };
    if(!post.likes.includes(userId)) {
        await post.updateOne({$push: {likes: userId}});
        return true;
    }else{
        await post.updateOne({$pull: {likes: userId}});
        return false
    }
}


exports.dislikePostService = async (postId, userId) => {
    const post = await Post.findById(postId);
    if(post.likes.includes(userId)) {
        await post.updateOne({$pull: {likes: userId}});
    };
    if(!post.dislikes.includes(userId)) {
        await post.updateOne({$push: {dislikes: userId}});
        return true;
    }else{
        await post.updateOne({$pull: {dislikes: userId}});
        return false;
    }
}


exports.getPostService = async (postId) => {
    const post = await Post.findById(postId).populate('user', '_id email username profilePicture').populate('attachments');
    return post;
}


exports.getAllPostsService = async (userId, limit, page) => {
    const postNumber = await Post.find({user: userId, group: null}).count();
    const posts = await Post.find({user: userId, group: null}).sort({createdAt: 'desc'}).limit(limit).skip((page-1)*limit)
    .populate('user', '_id email username profilePicture').populate('attachments');
    const totalPages = Math.ceil(postNumber / limit);
    const more = page * limit < postNumber;
    return {posts, totalPages, postNumber, more}
}

exports.getTagPostsService = async (tag, limit, page) => {
    const tagString = `#${tag}`;
    const postNumber = await Post.find({tags: {$in: tagString}}).count();
    const posts = await Post.find({tags: {$in: tagString}}).sort({createdAt: 'desc'}).limit(limit).skip((page-1)*limit)
    .populate('user', '_id email username profilePicture').populate('attachments');
    const totalPages = Math.ceil(postNumber / limit);
    const more = page * limit < postNumber;
    return {posts, totalPages, postNumber, more}
}


exports.getFeedPostsService = async (userId, limit, page) => {
    const currentUser = await User.findById(userId);
    const sources = [userId, ...currentUser.followings];
    const postNumber = await Post.find({$or: [{user: {$in: sources}}, {group: {$in: currentUser.groups}}] }).count();
    const postFeed = await Post.find({user: {$in: sources}}).sort({createdAt: 'desc'}).limit(limit).skip((page-1)*limit)
    .populate('user', '_id email username profilePicture').populate('attachments');
    const totalPages = Math.ceil(postNumber / limit);
    const more = page * limit < postNumber;
    return {postFeed, totalPages, postNumber, more};
}


exports.getGroupPostsService = async (groupId, limit, page) => {
    const postNumber = await Post.find({group: groupId}).count();
    const posts = await Post.find({group: groupId}).sort({createdAt: 'desc'}).limit(limit).skip((page-1)*limit)
    .populate('user', '_id email username profilePicture').populate('attachments');
    const totalPages = Math.ceil(postNumber / limit);
    const more = page * limit < postNumber;
    return {posts, totalPages, postNumber, more};
}