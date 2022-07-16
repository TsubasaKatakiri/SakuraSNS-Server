const GroupEventService = require('../services/GroupEvent.service');


exports.createGroupEvent = async (req, res, next) => {
    try {
        const { groupId } = req.params;
        const eventData = req.body;
        const event = await GroupEventService.createGroupEventService(groupId, eventData);
        res.status(201).json({ event, message: 'Group event created successfully' });
    } catch (e) {
        next(e);
    }
}


exports.getGroupEvent = async(req, res, next) => {
    try {
        const { groupEventId } = req.params;
        const event = await GroupEventService.getGroupEventService(groupEventId);
        res.status(200).json({ event, message: 'Group retrieved successfully' });
    } catch (e) {
        next(e);
    }
}


exports.getAllGroupEvents = async(req, res, next) => {
    try {
        const { groupId } = req.params;
        const events = await GroupEventService.getAllGroupEventsService(groupId);
        res.status(200).json({ events, message: 'Group retrieved successfully' });
    } catch (e) {
        next(e);
    }
}


exports.joinGroupEvent = async(req, res, next) => {
    try {
        const { groupId, groupEventId } = req.params;
        const { userId } = req.body;
        const {user, joined, left} = await GroupEventService.joinGroupEventService(groupId, groupEventId, userId);
        res.status(200).json({ user, joined, left, message: `Event ${joined ? 'joined' : 'left'} successfully` });
    } catch (e) {
        next(e);
    }
}


exports.editGroupEvent = async (req, res, next) => {
    try {
        const { groupId, groupEventId } = req.params;
        const eventData = req.body;
        const event = await GroupEventService.editGroupEventService( groupId, groupEventId, eventData);
        res.status(200).json({ event, message: 'Group event updated successfully' });
    } catch (e) {
        next(e);
    }
}


exports.deleteGroupEvent = async (req, res, next) => {
    try {
        const { groupId, groupEventId } = req.params;
        const { userId } = req.body;
        await GroupEventService.deleteGroupEventService(groupId, groupEventId, userId);
        res.status(200).json({ message: 'Group event deleted successfully' });
    } catch (e) {
        next(e);
    }
}