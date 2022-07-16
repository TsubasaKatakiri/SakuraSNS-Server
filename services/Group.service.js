const mongoose = require ('mongoose');
const APIError = require('../middleware/apiErrors.middleware');
const Group = require('../models/Group');
const Album = require('../models/ImageAlbum');
const User = require('../models/User');
const Audiofile = require('../models/Audiofile');
const checkPrivileges = require('../util/checkGroupUserPrivileges');


exports.createGroupService = async (groupData) => {
    const { groupname, creator, profilePicture, coverPicture, theme, description, groupCity, groupCountry, isPrivate, isFreeJoin } = groupData;
    const _id = new mongoose.Types.ObjectId();
    const group = await Group.create({ _id, groupname, creator: new mongoose.Types.ObjectId(creator), administrators: new mongoose.Types.ObjectId(creator), members: new mongoose.Types.ObjectId(creator), profilePicture, coverPicture, theme, description, groupCity, groupCountry, 'policies.isPrivate': isPrivate, 'policies.isFreeJoin': isFreeJoin });
    const albumId = new mongoose.Types.ObjectId();
    await Album.create({_id: albumId, name: 'Main album', owner: new mongoose.Types.ObjectId(creator), groupId: _id, 'albumSettings.isGroupAlbum': true, 'albumSettings.isRootAlbum': true, 'albumSettings.isUserPrivate': false, 'albumSettings.isGroupPrivate': false, 'albumSettings.isGroupLocked': false});
    await Group.findByIdAndUpdate(_id, {$push: {imageAlbums: albumId}});
    await User.findByIdAndUpdate(creator, { $push: { groups: _id } });
    return group;
}


exports.getGroupService = async(groupId) => {
    const group = await Group.findById(groupId).populate('members', '_id username email profilePicture').populate('administrators', '_id username email profilePicture').populate('moderators', '_id username email profilePicture').populate('groupEvents').populate('groupInfo').populate({path: 'imageAlbums', populate: {path: 'lastImage'}});
    return group;
}


exports.getGroupsByConditionsService = async(limit, page, query) => {
    const { groupname = '', groupCity = '', groupCountry = '', theme = '' } = query;
    const totalGroups = await Group.find({$and: [{groupname: {$regex: groupname, $options: 'i'}}, {groupCity: {$regex: groupCity, $options: 'i'}}, {groupCountry: {$regex: groupCountry, $options: 'i'}}, {themes: {$regex: theme}}] }).count();
    const groups = await Group.find({$and: [{groupname: {$regex: groupname, $options: 'i'}}, {groupCity: {$regex: groupCity, $options: 'i'}}, {groupCountry: {$regex: groupCountry, $options: 'i'}}, {theme: {$regex: theme}}] }).limit(limit).skip(limit * (page - 1));
    const totalPages = Math.ceil(totalGroups / limit);
    const more = page * limit < totalGroups;
    return { groups, totalPages, more };
}


exports.getUserGroupsByConditionsService = async(limit, page, query, userId) => {
    const { groupname = '', groupCity = '', groupCountry = '', theme = '' } = query;
    const user = await User.findById(userId);
    const totalGroups = await Group.find({$and: [{groupname: {$regex: groupname, $options: 'i'}}, {groupCity: {$regex: groupCity, $options: 'i'}}, {groupCountry: {$regex: groupCountry, $options: 'i'}}, {themes: {$regex: theme}}, {_id: {$in: user.groups}}] }).count();
    const groups = await Group.find({$and: [{groupname: {$regex: groupname, $options: 'i'}}, {groupCity: {$regex: groupCity, $options: 'i'}}, {groupCountry: {$regex: groupCountry, $options: 'i'}}, {theme: {$regex: theme}}, {_id: {$in: user.groups}}] }).limit(limit).skip(limit * (page - 1));
    const totalPages = Math.ceil(totalGroups / limit);
    const more = page * limit < totalGroups;
    return { groups, totalPages, more };
}


exports.editGroupInfoService = async (groupId, groupData) => {
    const { userId } = groupData;
    const group = await Group.findById(groupId);
    const editInfoLevel = group.policies.canEditGroupInfo;
    const check = checkPrivileges(group, userId, editInfoLevel);
    if(!check) throw APIError.ForbiddenError();
    await group.updateOne({$set: groupData});
    const updatedGroup = await Group.findById(groupId);
    return updatedGroup;
}


exports.editGroupPoliciesService = async (groupId, policiesData) => {
    const { userId, isPrivate, isFreeJoin, canEditGroupInfo, canEditGroupPolicies, canDeleteGroup, canDeleteDiscussions, canBanUsers, canAcceptJoinRequests, canDeletePosts, canSetEvents, canCreatePosts, canCreateThemes, canCreateAlbums, canUploadFiles } = policiesData;
    const group = await Group.findById(groupId);
    const editPoliciesLevel = group.policies.canEditGroupPolicies;
    const check = checkPrivileges(group, userId, editPoliciesLevel);
    if(!check) throw APIError.ForbiddenError();
    await group.updateOne({'policies.isPrivate': isPrivate, 'policies.isFreeJoin': isFreeJoin, 'policies.canEditGroupInfo': canEditGroupInfo, 'policies.canEditGroupPolicies': canEditGroupPolicies, 'policies.canDeleteGroup': canDeleteGroup, 'policies.canDeleteDiscussions': canDeleteDiscussions, 'policies.canBanUsers': canBanUsers, 'policies.canAcceptJoinRequests': canAcceptJoinRequests, 'policies.canDeletePosts': canDeletePosts, 'policies.canSetEvents': canSetEvents, 'policies.canCreatePosts': canCreatePosts, 'policies.canCreateThemes': canCreateThemes, 'policies.canCreateAlbums': canCreateAlbums, 'policies.canUploadFiles': canUploadFiles});
    const updatedGroup = await Group.findById(groupId);
    return updatedGroup;
}


exports.deleteGroupService = async (groupId, userId, groupname) => {
    const group = await Group.findById(groupId);
    const deletionLevel = group.policies.canDeleteGroup;
    const check = checkPrivileges(group, userId, deletionLevel);
    if(!check) throw APIError.ForbiddenError();
    if(groupname !== group.groupname) throw APIError.BadRequestError('Invalid group name');
    await group.deleteOne();
    const users = await User.find({groups: {$in: mongoose.Types.ObjectId(groupId)}});
    await users.update({$pull: {groups: groupId}});
    return;
}


exports.joinToGroupService = async (groupId, userId) => {
    const group = await Group.findById(groupId);
    if(group.bans.includes(mongoose.Types.ObjectId(userId))) throw APIError.ForbiddenError();
    if(group.policies.isFreeJoin){
        await group.updateOne({$push: {members: mongoose.Types.ObjectId(userId)}});
        await User.findByIdAndUpdate(userId, {$push: {groups: groupId}});
        return {joined: true, onWait: false}
    } else {
        await group.updateOne({$push: {joinRequests: mongoose.Types.ObjectId(userId)}});
        return {joined: false, onWait: true}
    }
}


exports.processJoinRequestService = async (groupId, userId, acceptingUserId, isAllowed) => {
    const group = await Group.findById(groupId);
    const acceptingJoinRequestsLevel = group.policies.canAcceptJoinRequests;
    let check = checkPrivileges(group, userId, acceptingJoinRequestsLevel);
    if(!check) throw APIError.ForbiddenError();
    if(!group.joinRequests.includes(mongoose.Types.ObjectId(acceptingUserId))) throw APIError.BadRequestError('User does not present in join request list');
    if(!isAllowed) {
        await group.updateOne({$pull: {members: mongoose.Types.ObjectId(acceptingUserId)}});
        const user = await User.findById(acceptingUserId);
        return {user, allowed: false};
    } else {
        await group.updateOne({$pull: {members: mongoose.Types.ObjectId(acceptingUserId)}, $push: {members: mongoose.Types.ObjectId(acceptingUserId)}});
        await User.findByIdAndUpdate(acceptingUserId, {$push: {groups: groupId}});
        const user = await User.findById(acceptingUserId).select("_id email username profilePicture");
        return {user, allowed: true};
    }
}


exports.banUserService = async (groupId, userId, banUserId) => {
    const group = await Group.findById(groupId);
    const banningLevel = group.policies.canBanUsers;
    let check = checkPrivileges(group, userId, banningLevel);
    if(!check) throw APIError.ForbiddenError();
    if(!group.bans.includes(mongoose.Types.ObjectId(banUserId))){
        if(group.administrators.includes(mongoose.Types.ObjectId(banUserId))) await group.updateOne({$pull: {administrators: mongoose.Types.ObjectId(banUserId)}});
        if(group.moderators.includes(mongoose.Types.ObjectId(banUserId))) await group.updateOne({$pull: {moderators: mongoose.Types.ObjectId(banUserId)}});
        await group.updateOne({$push: {bans: mongoose.Types.ObjectId(banUserId)}, $pull: {members: mongoose.Types.ObjectId(banUserId)}});
        await User.findByIdAndUpdate(banUserId, {$pull: {groups: groupId}});
        const user = await User.findById(banUserId).select('_id email username profilePicture');
        return { user, banned: true };
    } else {
        await group.updateOne({$pull: {bans: mongoose.Types.ObjectId(banUserId)}});
        const user = await User.findById(banUserId).select('_id email username profilePicture');
        return { user, banned: false };
    }
}


exports.levelUserService = async (groupId, userId, levelUserId, newUserLevel, currentUserLevel) => {
    const group = await Group.findById(groupId);
    const levelingLevel = group.policies.canUpdateUserLevels;
    let check = checkPrivileges(group, userId, levelingLevel);
    if(!check) throw APIError.ForbiddenError();
    switch(currentUserLevel){
        case 'administrator':
            await group.updateOne({$pull: {administrators: mongoose.Types.ObjectId(levelUserId)}});
            break;
        case 'moderator':
            await group.updateOne({$pull: {moderators: mongoose.Types.ObjectId(levelUserId)}});
            break;
        default:
            break;
    }
    switch(newUserLevel){
        case 'administrator':
            await group.updateOne({$push: {administrators: mongoose.Types.ObjectId(levelUserId)}});
            break;
        case 'moderator':
            await group.updateOne({$push: {moderators: mongoose.Types.ObjectId(levelUserId)}});
            break;
        default:
            break;
    }
    const user = await User.findById(levelUserId).select('_id email username profilePicture');
    return user;
}


exports.leaveGroupService = async (groupId, userId) => {
    const group = await Group.findById(groupId);
    if(group.administrators.includes(mongoose.Types.ObjectId(userId))) await group.updateOne({$pull: {administrators: mongoose.Types.ObjectId(userId)}});
    if(group.moderators.includes(mongoose.Types.ObjectId(userId))) await group.updateOne({$pull: {moderators: mongoose.Types.ObjectId(userId)}});
    await group.updateOne({$pull: {members: mongoose.Types.ObjectId(userId)}});
    await User.findByIdAndUpdate(userId, {$pull: {groups: groupId}});
    return;
}


exports.getAllGroupUsersService = async (limit, page, groupId, searchData) => {
    const {username='', city='', country='', school='', university='', company='', gender='', currentStatus=''} = searchData;
    const userRegex = new RegExp(username, 'i');
    const totalMembers = await User.find({$and: [{groups: {$in: mongoose.Types.ObjectId(groupId)}}, {username: userRegex}, {'extraData.city': {$regex: city, $options: 'i'}}, {'extraData.country': {$regex: country, $options: 'i'}}, {'extraData.school': {$regex: school, $options: 'i'}}, {'extraData.university': {$regex: university, $options: 'i'}}, {'extraData.company': {$regex: company, $options: 'i'}}, {'extraData.gender': {$regex: gender}}, {'extraData.currentStatus': {$regex: currentStatus}}] }).count();
    const members = await User.find({$and: [{groups: {$in: mongoose.Types.ObjectId(groupId)}}, {username: userRegex}, {'extraData.city': {$regex: city, $options: 'i'}}, {'extraData.country': {$regex: country, $options: 'i'}}, {'extraData.school': {$regex: school, $options: 'i'}}, {'extraData.university': {$regex: university, $options: 'i'}}, {'extraData.company': {$regex: company, $options: 'i'}}, {'extraData.gender': {$regex: gender}}, {'extraData.currentStatus': {$regex: currentStatus}}] }).limit(limit).skip(limit*(page-1));
    const totalPages = Math.ceil(totalMembers / limit);
    const more = page * limit < totalMembers;
    return {members, totalPages, more};
}

exports.getBannedGroupUsersService = async (limit, page, groupId, searchData) => {
    const {username = ''} = searchData;
    const group = await Group.findById(groupId);
    const totalMembers = await User.find({$and: [{username: {$regex: username, $options: 'i'}}, {_id: {$in: [group.bans]}}]}).count();
    const members = await User.find({$and: [{username: {$regex: username, $options: 'i'}}, {_id: {$in: [group.bans]}}]}).limit(limit).skip(limit*(page-1));
    const totalPages = Math.ceil(totalMembers / limit);
    const more = page * limit < totalMembers;
    return {members, totalPages, more};
}

exports.getGroupRequestsService = async (limit, page, groupId, searchData) => {
    const {username = ''} = searchData;
    const group = await Group.findById(groupId);
    const totalMembers = await User.find({$and: [{username: {$regex: username, $options: 'i'}}, {_id: {$in: [group.joinRequests]}}]}).count();
    const members = await User.find({$and: [{username: {$regex: username, $options: 'i'}}, {_id: {$in: [group.joinRequests]}}]}).limit(limit).skip(limit*(page-1));
    const totalPages = Math.ceil(totalMembers / limit);
    const more = page * limit < totalMembers;
    return {members, totalPages, more};
}


exports.addAudioService = async (groupId, audioData) => {
    const {name, artist, audiofile, uploader} = audioData;
    const group = await Group.findById(groupId);
    const uploadingLevel = group.policies.canUploadFiles;
    let check = checkPrivileges(group, uploader, uploadingLevel);
    if(!check) throw APIError.ForbiddenError();
    const _id =  new mongoose.Types.ObjectId();
    const newAudio = await Audiofile.create({_id, name, artist, audiofile, uploader: mongoose.Types.ObjectId(uploader), groupId});
    await group.updateOne({$push: {music: mongoose.Types.ObjectId(_id)}});
    return newAudio;
}


exports.removeAudioService = async (groupId, audioId, userId) => {
    const audiofile = await Audiofile.findById(audioId);
    const group = await Group.findById(groupId);
    const uploadingLevel = group.policies.canUploadFiles;
    let check = checkPrivileges(group, uploader, uploadingLevel);
    if(!check || audiofile.uploader.toString() !== userId) throw APIError.ForbiddenError();
    await audiofile.deleteOne();
    await group.updateOne({$pull: {music: mongoose.Types.ObjectId(_id)}});
    return;
}