const mongoose = require ('mongoose');
const APIError = require('../middleware/apiErrors.middleware');
const Group = require('../models/Group');
const User = require('../models/User');
const GroupEvent = require('../models/GroupEvent');
const checkPrivileges = require('../util/checkGroupUserPrivileges');


exports.createGroupEventService = async (groupId, eventData) => {
    const { userId, eventName, eventDate, eventDescription, eventLocation, eventImage } = eventData;
    const _id = new mongoose.Types.ObjectId();
    const group = await Group.findById(groupId);
    const setEventsLevel = group.policies.canSetEvents;
    let check = checkPrivileges(group, userId, setEventsLevel);
    if(!check) throw APIError.ForbiddenError();
    const event = await GroupEvent.create({ _id, group: mongoose.Types.ObjectId(groupId), eventName, eventDate, eventDescription, eventLocation, eventImage})
    await group.updateOne({$push: {groupEvents: _id}});
    return event;
}


exports.getGroupEventService = async(groupEventId) => {
    const event = await GroupEvent.findById(groupEventId).populate('group', '_id groupname profilePicture').populate('participants', '_id username email');
    return event;
}


exports.getAllGroupEventsService = async(groupId) => {
    const events = await GroupEvent.find({group: groupId}).populate('group', '_id groupname profilePicture');
    return events;
}


exports.joinGroupEventService = async(groupId, groupEventId, userId) => {
    const group = await Group.findById(groupId);
    if(!group.members.includes(userId)) throw APIError.ForbiddenError();
    const event = await GroupEvent.findById(groupEventId);
    const user = await User.findById(userId);
    if (event.participants.includes(userId)){
        await event.updateOne({$pull: {participants: userId}});
        return {user, joined: false, left: true};
    } else {
        await event.updateOne({$push: {participants: userId}});
        return {user, joined: true, left: false};
    }
}


exports.editGroupEventService = async (groupId, groupEventId, eventData) => {
    const { userId, eventName, eventDate, eventDescription, eventLocation, eventImage } = eventData;
    const group = await Group.findById(groupId);
    const setEventsLevel = group.policies.canSetEvents;
    let check = checkPrivileges(group, userId, setEventsLevel);
    if(!check) throw APIError.ForbiddenError();
    const event = await GroupEvent.findById(groupEventId);
    await event.updateOne({ eventName, eventDate, eventDescription, eventLocation, eventImage });
    const updatedEvent = await GroupEvent.findById(groupEventId);
    return updatedEvent;
}


exports.deleteGroupEventService = async (groupId, groupEventId, userId) => {
    const group = await Group.findById(groupId);
    const setEventsLevel = group.policies.canSetEvents;
    let check = checkPrivileges(group, userId, setEventsLevel);
    if(!check) throw APIError.ForbiddenError();
    await GroupEvent.findByIdAndDelete(groupEventId);
    await group.updateOne({$pull: {groupEvents: groupEventId}});
    return;
}