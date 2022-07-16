const mongoose = require ('mongoose');
const APIError = require('../middleware/apiErrors.middleware');
const Group = require('../models/Group');
const GroupInfoBlock = require('../models/GroupInfoBlock');
const checkPrivileges = require('../util/checkGroupUserPrivileges');


exports.createGroupInfoBlockService = async (groupId, userId, infoBlockHeader, infoBlockText, infoBlockImages) => {
    const _id = new mongoose.Types.ObjectId();
    const group = await Group.findById(groupId);
    const editGroupInfoLevel = group.policies.canEditGroupInfo;
    let check = checkPrivileges(group, userId, editGroupInfoLevel);
    if(!check) throw APIError.ForbiddenError();
    const infoBlock = await GroupInfoBlock.create({_id, groupId: mongoose.Types.ObjectId(groupId), infoBlockText, infoBlockHeader, infoBlockImages});
    await group.updateOne({$push: {groupInfo: _id}});
    return infoBlock;
}


exports.getGroupInfoBlockService = async (infoBlockId) => {
    const infoBlock = await GroupInfoBlock.findById(infoBlockId).populate('infoBlockImages');
    return infoBlock;
}


exports.getAllGroupInfoBlocksService = async (groupId) => {
    const infoBlocks = await GroupInfoBlock.find({groupId});
    return infoBlocks;
}


exports.editGroupInfoBlockService = async (groupId, infoBlockId, userId, infoBlockHeader, infoBlockText, infoBlockImages) => {
    const group = await Group.findById(groupId);
    const editGroupInfoLevel = group.policies.canEditGroupInfo;
    let check = checkPrivileges(group, userId, editGroupInfoLevel);
    if(!check) throw APIError.ForbiddenError();
    const infoBlock = await GroupInfoBlock.findById(infoBlockId);
    await infoBlock.updateOne({infoBlockText, infoBlockHeader, infoBlockImages: infoBlockImages})
    const updatedInfoBlock = await GroupInfoBlock.findById(infoBlockId).populate('infoBlockImages');
    return updatedInfoBlock;
}


exports.deleteGroupInfoBlockService = async (groupId, infoBlockId, userId) => {
    const group = await Group.findById(groupId);
    const editGroupInfoLevel = group.policies.canEditGroupInfo;
    let check = checkPrivileges(group, userId, editGroupInfoLevel);
    if(!check) throw APIError.ForbiddenError();
    const infoBlock = await GroupInfoBlock.findById(infoBlockId);
    await infoBlock.deleteOne();
    return;
}