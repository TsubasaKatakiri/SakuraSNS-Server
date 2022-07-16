const GroupService = require('../services/Group.service');


exports.createGroup = async (req, res, next) => {
    try {
        const groupData = req.body;
        const group = await GroupService.createGroupService(groupData);
        res.status(201).json({ group, message: 'Group created successfully' });
    } catch (e) {
        next(e);
    }
}


exports.getGroup = async(req, res, next) => {
    try {
        const { groupId } = req.params;
        const group = await GroupService.getGroupService(groupId);
        res.status(200).json({ group, message: 'Group retrieved successfully' });
    } catch (e) {
        next(e);
    }
}


exports.getGroupsByConditions = async(req, res, next) => {
    try {
        const {limit = 10, page = 1} = req.query;
        const query = req.body;
        const {groups, totalPages, more} = await GroupService.getGroupsByConditionsService(limit, page, query);
        res.status(200).json({ groups, page, limit, totalPages, more, message: 'Groups retrieved successfully' });
    } catch (e) {
        next(e);
    }
}


exports.getUserGroupsByConditions = async(req, res, next) => {
    try {
        const {limit = 10, page = 1} = req.query;
        const userId = req.params.userId;
        const query = req.body;
        const {groups, totalPages, more} = await GroupService.getUserGroupsByConditionsService(limit, page, query, userId);
        res.status(200).json({ groups, page, limit, totalPages, more, message: 'Groups retrieved successfully' });
    } catch (e) {
        next(e);
    }
}


exports.editGroupInfo = async (req, res, next) => {
    try {
        const { groupId } = req.params;
        const groupData = req.body;
        const group = await GroupService.editGroupInfoService(groupId, groupData);
        res.status(200).json({ group, message: 'Group created successfully' });
    } catch (e) {
        next(e);
    }
}


exports.editGroupPolicies = async (req, res, next) => {
    try {
        const { groupId } = req.params;
        const policiesData = req.body;
        const group = await GroupService.editGroupPoliciesService(groupId, policiesData);
        res.status(200).json({ group, message: 'Group created successfully'});
    } catch (e) {
        next(e);
    }
}


exports.deleteGroup = async (req, res, next) => {
    try {
        const { groupId } = req.params;
        const { userId, groupname } = req.body;
        await GroupService.deleteGroupService(groupId, userId, groupname);
        res.status(200).json({message: 'Group deleted successfully'});
    } catch (e) {
        next(e);
    }
}


exports.joinToGroup = async (req, res, next) => {
    try {
        const { groupId } = req.params;
        const { userId } = req.body;
        const {joined, onWait} = await GroupService.joinToGroupService(groupId, userId);
        res.status(200).json({ joined, onWait, message: `User ${joined ? 'joined' : 'requested to join'} to the group successfully` });
    } catch (e) {
        next(e);
    }
}


exports.processJoinRequest = async (req, res, next) => {
    try {
        const { groupId } = req.params;
        const { userId, acceptingUserId, isAllowed } = req.body;
        const {user, allowed} = await GroupService.processJoinRequestService(groupId, userId, acceptingUserId, isAllowed);
        res.status(200).json({ user, allowed, message: `User is ${!allowed ? 'not' : ''} allowed to join the group` });
    } catch (e) {
        next(e);
    }
}


exports.banUser = async (req, res, next) => {
    try {
        const { groupId } = req.params;
        const { userId, banUserId } = req.body;
        const {user, banned} = await GroupService.banUserService(groupId, userId, banUserId);
        res.status(200).json({ user, banned, message: `User is ${!banned ? 'un' : ''}banned in this group` });
    } catch (e) {
        next(e);
    }
}


exports.levelUser = async (req, res, next) => {
    try {
        const { groupId } = req.params;
        const { userId, levelUserId, newUserLevel, currentUserLevel } = req.body;
        const user = await GroupService.levelUserService(groupId, userId, levelUserId, newUserLevel, currentUserLevel);
        res.status(200).json({ user, oldLevel: currentUserLevel, newLevel: newUserLevel, message: 'User level is changed' });
    } catch (e) {
        next(e);
    }
}


exports.leaveGroup = async (req, res, next) => {
    try {
        const { groupId } = req.params;
        const { userId } = req.body;
        await GroupService.leaveGroupService(groupId, userId);
        res.status(200).json({ message: 'User left group successfully' });
    } catch (e) {
        next(e);
    }
}


exports.getAllGroupUsers = async (req, res, next) => {
    try {
        const {limit = 25, page = 1} = req.query;
        const {groupId} = req.params;
        const searchData = req.body;
        const {members, totalPages, more} = await GroupService.getAllGroupUsersService(limit, page, groupId, searchData);
        res.status(200).json({members, page, limit, totalPages, more, message: 'Users retrieved successfully'});
    } catch (e) {
        next(e);
    }
}

exports.getBannedGroupUsers = async (req, res, next) => {
    try {
        const {limit = 25, page = 1} = req.query;
        const {groupId} = req.params;
        const searchData = req.body;
        const {members, totalPages, more} = await GroupService.getBannedGroupUsersService(limit, page, groupId, searchData);
        res.status(200).json({members, page, limit, totalPages, more, message: 'Users retrieved successfully'});
    } catch (e) {
        next(e);
    }
}

exports.getGroupRequests = async (req, res, next) => {
    try {
        const {limit = 25, page = 1} = req.query;
        const {groupId} = req.params;
        const searchData = req.body;
        const {members, totalPages, more} = await GroupService.getGroupRequestsService(limit, page, groupId, searchData);
        res.status(200).json({members, page, limit, totalPages, more, message: 'Users retrieved successfully'});
    } catch (e) {
        next(e);
    }
}


//Get all group users
exports.addAudio = async (req, res, next) => {
    try {
        const { groupId } = req.params;
        const audioData = req.body;
        const audio = await GroupService.addAudioService(groupId, audioData);
        res.status(200).json({audio, message: 'Audio successfully uploaded'});
    } catch (e) {
        next(e);
    }
}


//Get all group users
exports.removeAudio = async (req, res, next) => {
    try {
        const { groupId } = req.params;
        const { audioId, userId } = req.body;
        await GroupService.removeAudioService(groupId, audioId, userId);
        res.status(200).json({message: 'Audio successfully removed'});
    } catch (e) {
        next(e);
    }
}