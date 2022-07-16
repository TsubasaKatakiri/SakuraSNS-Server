const APIError = require('../middleware/apiErrors.middleware');
const User = require('../models/User');
const Group = require('../models/Group');
const bcrypt = require('bcrypt');


exports.userInfoService = async (userId) => {
    const user = await User.findById(userId)
    .populate('followers', '_id email username profilePicture')
    .populate('followings', '_id email username profilePicture birthdayDate')
    .populate('groups', '_id groupname profilePicture')
    .populate({path: 'imageAlbums', populate: {path: 'lastImage'}})
    .select('-password');
    return user;
}

exports.findUserService = async (userId) => {
    const user = await User.findById(userId)
    .populate('followers', '_id email username profilePicture')
    .populate('followings', '_id email username profilePicture birthdayDate')
    .populate('groups', '_id groupname profilePicture')
    .populate({path: 'imageAlbums', populate: {path: 'lastImage'}})
    .select('-password');
    return user;
}

exports.searchUsersService = async (search) => {
    let regex = new RegExp(search, 'i');
    const users = await User.find({username: regex}).select('-password').limit(10);
    return users;
}


exports.searchUsersAdvancedService = async (limit, page, query) => {
    const {username = '', city = '', country = '', school = '', university = '', company = '', gender = '', currentStatus = ''} = query;
    const totalUsers = await User.find({$and: [{username: {$regex: username, $options: 'i'}}, {'extraData.city': {$regex: city, $options: 'i'}}, {'extraData.country': {$regex: country, $options: 'i'}}, {'extraData.school': {$regex: school, $options: 'i'}}, {'extraData.university': {$regex: university, $options: 'i'}}, {'extraData.company': {$regex: company, $options: 'i'}}, {'extraData.gender': {$regex: gender}}, {'extraData.currentStatus': {$regex: currentStatus}}] }).count();
    const users = await User.find({$and: [{username: {$regex: username, $options: 'i'}}, {'extraData.city': {$regex: city, $options: 'i'}}, {'extraData.country': {$regex: country, $options: 'i'}}, {'extraData.school': {$regex: school, $options: 'i'}}, {'extraData.university': {$regex: university, $options: 'i'}}, {'extraData.company': {$regex: company, $options: 'i'}}, {'extraData.gender': {$regex: gender}}, {'extraData.currentStatus': {$regex: currentStatus}}] }).limit(limit).skip(limit * (page - 1));
    const totalPages = Math.ceil(totalUsers / limit);
    const more = page * limit < totalUsers;
    return {users, totalPages, more};
}


exports.userFriendsService = async (userId, limit, page) => {
    const user = await User.findById(userId);
    const totalFriends = user.followings.length;
    const friends = await User.find({_id: {$in: user.followings}}).limit(limit).skip(limit * (page - 1));
    const totalPages = Math.ceil(totalFriends / limit);
    const more = page * limit < totalFriends;
    return {friends, totalPages, more};
}


exports.userFollowersService = async (userId, limit, page) => {
    const user = await User.findById(userId);
    const totalFriends = user.followers.length;
    const friends = await User.find({_id: {$in: user.followers}}).limit(limit).skip(limit * (page - 1));
    const totalPages = Math.ceil(totalFriends / limit);
    const more = page * limit < totalFriends;
    return {friends, totalPages, more};
}

exports.searchFriendsAdvancedService = async (limit, page, query, userId) => {
    const {username = '', city = '', country = '', school = '', university = '', company = '', gender = '', currentStatus = ''} = query;
    const user = await User.findById(userId);
    const totalFriends = await User.find({$and: [{_id: {$in: user.followings}}, {username: {$regex: username, $options: 'i'}}, {'extraData.city': {$regex: city, $options: 'i'}}, {'extraData.country': {$regex: country, $options: 'i'}}, {'extraData.school': {$regex: school, $options: 'i'}}, {'extraData.university': {$regex: university, $options: 'i'}}, {'extraData.company': {$regex: company, $options: 'i'}}, {'extraData.gender': {$regex: gender}}, {'extraData.currentStatus': {$regex: currentStatus}}] });
    const friends = await User.find({$and: [{_id: {$in: user.followings}}, {username: {$regex: username, $options: 'i'}}, {'extraData.city': {$regex: city, $options: 'i'}}, {'extraData.country': {$regex: country, $options: 'i'}}, {'extraData.school': {$regex: school, $options: 'i'}}, {'extraData.university': {$regex: university, $options: 'i'}}, {'extraData.company': {$regex: company, $options: 'i'}}, {'extraData.gender': {$regex: gender}}, {'extraData.currentStatus': {$regex: currentStatus}}] }).limit(limit).skip(limit * (page - 1));
    const totalPages = Math.ceil(totalFriends / limit);
    const more = page * limit < totalFriends;
    return {friends, totalPages, more};
}


exports.searchFollowersAdvancedService = async (limit, page, query, userId) => {
    const {username = '', city = '', country = '', school = '', university = '', company = '', gender = '', currentStatus = ''} = query;
    const user = await User.findById(userId);
    const totalFriends = await User.find({$and: [{_id: {$in: user.followers}}, {username: {$regex: username, $options: 'i'}}, {'extraData.city': {$regex: city, $options: 'i'}}, {'extraData.country': {$regex: country, $options: 'i'}}, {'extraData.school': {$regex: school, $options: 'i'}}, {'extraData.university': {$regex: university, $options: 'i'}}, {'extraData.company': {$regex: company, $options: 'i'}}, {'extraData.gender': {$regex: gender}}, {'extraData.currentStatus': {$regex: currentStatus}}] });
    const friends = await User.find({$and: [{_id: {$in: user.followers}}, {username: {$regex: username, $options: 'i'}}, {'extraData.city': {$regex: city, $options: 'i'}}, {'extraData.country': {$regex: country, $options: 'i'}}, {'extraData.school': {$regex: school, $options: 'i'}}, {'extraData.university': {$regex: university, $options: 'i'}}, {'extraData.company': {$regex: company, $options: 'i'}}, {'extraData.gender': {$regex: gender}}, {'extraData.currentStatus': {$regex: currentStatus}}] }).limit(limit).skip(limit * (page - 1));
    const totalPages = Math.ceil(totalFriends / limit);
    const more = page * limit < totalFriends;
    return {friends, totalPages, more};
}


exports.userGroupsService = async (userId, query, limit, page) => {
    const user = await User.findById(userId);
    const totalGroups = user.groups.length;
    const groups = await Group.find({_id: {$in: user.groups}}).limit(limit).skip(limit * (page - 1));
    const totalPages = Math.ceil(totalGroups / limit);
    const more = page * limit < totalGroups;
    return {groups, totalPages, more};
}

exports.modifyUserService = async (userId, userData) => {
    const changeUserId = userData.id;
    if(userId !== changeUserId) throw APIError.ForbiddenError();
    await User.findByIdAndUpdate(changeUserId, {$set: userData});
    const user = await User.findById(changeUserId);
    return user;
}

exports.modifyUserPasswordService = async (userId, changeUserId, oldPassword, newPassword) => {
    if(userId !== changeUserId) throw APIError.ForbiddenError();
    if(!oldPassword) throw APIError.BadRequestError('Please enter valid old password');
    const checkUser = await User.findById(changeUserId);
    const validPassword = await bcrypt.compare(oldPassword, checkUser.password);
    if(!validPassword) throw APIError.BadRequestError('Please enter valid old password');
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(newPassword, salt);
    await User.findByIdAndUpdate(changeUserId, {password: passwordHash});
    const user = await User.findById(changeUserId);
    return user;
}

exports.changeUserStatusService = async (userId, changeUserId, status) => {
    if(userId !== changeUserId) throw APIError.ForbiddenError();
    await User.findByIdAndUpdate(changeUserId, {status: status});
    return;
}

exports.modifyUserSettingsService = async(userData, userId)=>{
    const {id, canAcceptMessages, canAccessPage, canAccessMusic, canAccessVideos, canAccessAlbums, canAccessFollowers, canAccessFollowings, canAccessGroups} = userData;
    if(id !== userId) throw APIError.ForbiddenError();
    const user = await User.findById(userId);
    await user.updateOne({'userSettings.canAcceptMessages': canAcceptMessages, 'userSettings.canAccessPage': canAccessPage, 'userSettings.canAccessMusic': canAccessMusic, 'userSettings.canAccessVideos': canAccessVideos, 'userSettings.canAccessAlbums': canAccessAlbums, 'userSettings.canAccessFollowers': canAccessFollowers, 'userSettings.canAccessFollowings': canAccessFollowings, 'userSettings.canAccessGroups': canAccessGroups});
    const updated = await User.findById(userId);
    return updated;
}

exports.toggleDarkModeService = async (userId)=>{
    const user = await User.findById(userId);
    if(user.userSettings.isDarkMode){
        await user.updateOne({'userSettings.isDarkMode': false});
        return false;
    } else {
        await user.updateOne({'userSettings.isDarkMode': true});
        return true;
    }
}

exports.modifyExtraDataService = async(userData, userId)=>{
    const {id, city, country, school, university, company, gender, currentStatus, aboutMe, hobbies, likes, dislikes} = userData;
    if(id !== userId) throw APIError.ForbiddenError();
    const user = await User.findById(userId);
    await user.updateOne({'extraData.city': city, 'extraData.country': country, 'extraData.school': school, 'extraData.university': university, 'extraData.company': company, 'extraData.gender': gender, 'extraData.currentStatus': currentStatus, 'extraData.aboutMe': aboutMe, 'extraData.hobbies': hobbies, 'extraData.likes': likes, 'extraData.dislikes': dislikes});
    const updated = await User.findById(userId);
    return updated;
}

exports.followUnfollowUserService = async (followUserId, userId) => {
    if(followUserId === userId) throw APIError.BadRequestError('Error while following a user');
    const user = await User.findById(followUserId);
    const currentUser = await User.findById(userId);
    if(!user.followers.includes(userId)){
        await user.updateOne({$push: {followers: currentUser._id}});
        await currentUser.updateOne({$push: {followings: user._id}});
        return true;
    } else {
        await user.updateOne({$pull: {followers: currentUser._id}}); 
        await currentUser.updateOne({$pull: {followings: user._id}});
        return false;
    }
}

exports.blacklistUserService = async (blacklistUserId, userId) => {
    const user = await User.findById(blacklistUserId).select('_id email username profilePicture');
    if(!user) throw APIError.BadRequestError('Invalid user ID');
    if(user._id === userId) throw APIError.BadRequestError('Cannot blacklist this user');
    const currentUser = await User.findById(userId);
    if(!currentUser.blacklist.includes(blacklistUserId)){
        await currentUser.updateOne({$push: {blacklist: blacklistUserId}});
        return {user, blacklisted: true};
    } else {
        await currentUser.updateOne({$pull: {blacklist: blacklistUserId}});
        return {user, blacklisted: false};
    }
}

exports.getBlacklistedUsersService = async (userId) => {
    const currentUser = await User.findById(userId);
    const users = await User.find({_id: {$in: currentUser.blacklist}}).select('_id email username profilePicture');
    return users;
}

exports.promoteUserService = async(promoteUserId, role, userId) => {
    const currentUser = await User.findById(userId);
    if(currentUser.userSettings.userRole !== 'admin') throw APIError.ForbiddenError();
    const user = await User.findById(promoteUserId);
    await user.updateOne({'userSettings.userRole': role});
    const updatedUser = await User.findById(promoteUserId);
    return updatedUser;
}

exports.banUserService = async(banUserId, userId) => {
    if(banUserId === userId) throw APIError.BadRequestError('Cannot ban this user');
    const currentUser = await User.findById(userId);
    if(currentUser.userSettings.userRole !== 'admin') throw APIError.ForbiddenError();
    const user = await User.findById(banUserId);
    if(user.userSettings.userRole === 'admin') throw APIError.BadRequestError('Cannot ban this user');
    if(!user.userSettings.isBanned){
        await user.updateOne({'userSettings.isBanned': true});
        return true;
    } else {
        await user.updateOne({'userSettings.isBanned': false});
        return false;
    }
}