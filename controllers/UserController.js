const User = require('../models/User');
const UserService = require('../services/User.service');

exports.userInfo = async (req, res, next) => {
    try {
        const userId = req.user.id; 
        const user = await UserService.userInfoService(userId);
        res.status(200).json({user, message: 'User data fetched successfully'});
    } catch (e) {
        next(e);
    }
}


exports.findUser = async (req, res, next) => {
    try {
        const userId = req.params.id;
        const user = await UserService.findUserService(userId);
        res.status(200).json({user: user, message: `${user.login} data retrieved successfully`});
    } catch (e) {
        next(e);
    }
}


exports.searchUsers = async (req, res, next) => {
    try {
        const search = req.body.search;
        const users = await UserService.searchUsersService(search);
        res.status(200).json({users, message: `Users retrieved successfully`});
    } catch (e) {
        next(e);
    }
}


exports.searchUsersAdvanced = async (req, res, next) => {
    try {
        const {limit = 10, page = 1} = req.query;
        const query = req.body;
        const {users, totalPages, more} = await UserService.searchUsersAdvancedService(limit, page, query);
        res.status(200).json({users, page, limit, totalPages, more, message: 'Users retrieved successfully'});
    } catch (e) {
        next(e);
    }
}


exports.userFriends = async (req, res, next) => {
    try {
        const {limit = 10, page = 1} = req.query;
        const userId = req.params.id;
        const {friends, totalPages, more} = await UserService.userFriendsService(userId, limit, page);
        res.status(200).json({friends, page, limit, totalPages, more, message: 'Friends data retrieved successfully'})
    } catch (e) {
        next(e);
    }
}


exports.searchFriendsAdvanced = async (req, res, next) => {
    try {
        const {limit = 10, page = 1} = req.query;
        const query = req.body;
        const userId = req.params.id;
        const {friends, totalPages, more} = await UserService.searchFriendsAdvancedService(limit, page, query, userId);
        res.status(200).json({friends, page, limit, totalPages, more, message: 'Users retrieved successfully'});
    } catch (e) {
        next(e);
    }
}


exports.searchFollowersAdvanced = async (req, res, next) => {
    try {
        const {limit = 10, page = 1} = req.query;
        const query = req.body;
        const userId = req.params.id;
        const {friends, totalPages, more} = await UserService.searchFollowersAdvancedService(limit, page, query, userId);
        res.status(200).json({friends, page, limit, totalPages, more, message: 'Users retrieved successfully'});
    } catch (e) {
        next(e);
    }
}


exports.userGroups = async (req, res, next) => {
    try {
        const {limit = 10, page = 1} = req.query;
        const query = req.body;
        const userId = req.params.id;
        const {groups, totalPages, more} = await UserService.userGroupsService(userId, query, limit, page);
        res.status(200).json({groups, page, limit, totalPages, more, message: 'Friends data retrieved successfully'})
    } catch (e) {
        next(e);
    }
}


exports.modifyUser = async (req, res, next) => {
    try {
        const userId = req.params.id;
        const userData = req.body;
        const user = await UserService.modifyUserService(userId, userData);
        res.status(200).json({user: user, message: 'User account updated successfully'});
    } catch (e) {
        next(e);
    }
}


exports.modifyUserPassword = async (req, res, next) => {
    try {
        const userId = req.params.id; 
        const {id, oldPassword, newPassword} = req.body;
        const user = await UserService.modifyUserPasswordService(id, userId, oldPassword, newPassword);
        res.status(200).json({user: user, message: 'User password updated successfully'});
    } catch (e) {
        next(e);
    }
}


exports.changeUserStatus = async (req, res, next) => {
    try {
        const userId = req.params.id;
        const {id, status} = req.body;
        await UserService.changeUserStatusService(id, userId, status);
        res.status(200).json({message: 'User status updated successfully'});
    } catch (e) {
        next(e);
    }
}


exports.modifyExtraData = async(req, res, next)=>{
    try {
        const userId = req.params.userId;
        const userData = req.body;
        const user = await UserService.modifyExtraDataService(userData, userId);
        res.status(200).json({user, message: 'User updated successfully'});
    } catch (e) {
        next(e);
    }
}


exports.modifyUserSettings = async(req, res, next)=>{
    try {
        const userId = req.params.userId;
        const userData = req.body;
        const user = await UserService.modifyUserSettingsService(userData, userId);
        res.status(200).json({user, message: 'User updated successfully'});
    } catch (e) {
        next(e);
    }
}


exports.toggleDarkMode = async(req, res, next)=>{
    try {
        const userId = req.params.id;
        const isDark = await UserService.toggleDarkModeService(userId);
        res.status(200).json({isDark, message: 'Dark mode toggled successfully'});
    } catch (e) {
        next(e);
    }
}


exports.followUser = async (req, res, next) => {
    try {
        const followUserId = req.params.id;
        const userId = req.body.id;
        const followed = await UserService.followUnfollowUserService(followUserId, userId);
        res.status(200).json({followed, message: 'User followed successfully'});
    } catch (e) {
        next(e);
    }
}


exports.blacklistUser = async(req, res, next) => {
    try {
        const blacklistUserId = req.params.userId;
        const userId = req.body.userId;
        const {user, blacklisted} = await UserService.blacklistUserService(blacklistUserId, userId);
        res.status(200).json({user, blacklisted, message: `User ${blacklisted ? 'added to' : 'removed from'} blacklist successfully`});
    } catch (e) {
        next(e);
    }
}


exports.getBlacklistedUsers = async(req, res, next) => {
    try {
        const userId = req.params.userId;
        const users = await UserService.getBlacklistedUsersService(userId);
        res.status(200).json({users, message: 'Users fetched successfully'});
    } catch (e) {
        next(e);
    }
}


exports.promoteUser = async(req, res, next) => {
    try {
        const promoteUserId = req.params.id;
        const {role, userId} = req.body;
        const user = await UserService.promoteUserService(promoteUserId, role, userId);
        res.status(200).json({user, message: 'User updated successfully'});
    } catch (e) {
        next(e);
    }
}


exports.banUser = async(req, res, next) => {
    try {
        const banUserId = req.params.id;
        const userId = req.body.userId;
        const isBanned = await banUserService.promoteUserService(banUserId, userId);
        res.status(200).json({isBanned, message: `User ${isBanned ? 'banned' : 'unbanned'} successfully`});
    } catch (e) {
        next(e);
    }
}


exports.addSettings = async(req, res) => {
    try{
        const userId = req.params.id;
        const {userRole, isBanned, canAcceptMessages, canAccessPage, canAccessMusic, canAccessVideos, canAccessAlbums, canAccessFollowers, canAccessFollowings, canAccessGroups} = req.body;
        const userEdit = await User.findById(userId);
        await userEdit.updateOne({'userSettings.userRole': userRole, 'userSettings.isBanned': isBanned, 'userSettings.canAcceptMessages': canAcceptMessages, 'userSettings.canAccessPage': canAccessPage, 'userSettings.canAccessMusic': canAccessMusic, 'userSettings.canAccessVideos': canAccessVideos, 'userSettings.canAccessAlbums': canAccessAlbums, 'userSettings.canAccessFollowers': canAccessFollowers, 'userSettings.canAccessFollowings': canAccessFollowings, 'userSettings.canAccessGroups': canAccessGroups});
        const user = await User.findById(userId);
        res.status(200).json({user, message: 'Settings added successfully'});
    }catch(e){
        res.status(500).json(e);
    }
}