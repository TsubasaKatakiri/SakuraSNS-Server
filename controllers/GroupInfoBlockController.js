const GroupInfoBlockService = require('../services/GroupInfoBlock.service');


exports.createGroupInfoBlock = async (req, res, next) => {
    try {
        const { groupId } = req.params;
        const { userId, infoBlockHeader, infoBlockText, infoBlockImages } = req.body;
        const infoBlock = await GroupInfoBlockService.createGroupInfoBlockService(groupId, userId, infoBlockHeader, infoBlockText, infoBlockImages);
        res.status(201).json({ infoBlock, message: 'Info block created successfully' });
    } catch (e) {
        next(e);
    }
}


exports.getGroupInfoBlock = async (req, res, next) => {
    try {
        const { infoBlockId } = req.params;
        const infoBlock = await GroupInfoBlockService.getGroupInfoBlockService(infoBlockId);
        res.status(200).json({ infoBlock, message: 'Info block retrieved successfully' });
    } catch (e) {
        next(e);
    }
}


exports.getAllGroupInfoBlocks = async (req, res, next) => {
    try {
        const { groupId } = req.params;
        const infoBlocks = await GroupInfoBlockService.getAllGroupInfoBlocksService(groupId);
        res.status(200).json({ infoBlocks, message: 'Group info blocks retrieved successfully' });
    } catch (e) {
        next(e);
    }
}


exports.editGroupInfoBlock = async (req, res, next) => {
    try {
        const { groupId, infoBlockId } = req.params;
        const { userId, infoBlockHeader, infoBlockText, infoBlockImages } = req.body;
        const infoBlock = await GroupInfoBlockService.editGroupInfoBlockService(groupId, infoBlockId, userId, infoBlockHeader, infoBlockText, infoBlockImages);
        res.status(200).json({ infoBlock, message: 'Info block updated successfully' });
    } catch (e) {
        next(e);
    }
}


exports.deleteGroupInfoBlock = async (req, res, next) => {
    try {
        const { groupId, infoBlockId } = req.params;
        const { userId } = req.body;
        await GroupInfoBlockService.deleteGroupInfoBlockService(groupId, infoBlockId, userId);
        res.status(200).json({ message: 'Info block deleted successfully' });
    } catch (e) {
        next(e);
    }
}