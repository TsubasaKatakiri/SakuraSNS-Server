const ConversationService = require('../services/Conversation.service');


exports.create = async (req, res, next) => {
    try {
        const { senderId, receiverId } = req.body;
        const { conversation, isCreated } = await ConversationService.createConversationService(senderId, receiverId);
        res.status(200).json({conversation, isCreated, message: `${isCreated ? 'Conversation created successfully' : 'Conversation already exists'}`});
    } catch (e) {
        next(e);
    }
}


exports.getAll = async (req, res, next) => {
    try {
        const userId = req.params.userId;
        const conversations = await ConversationService.getAllConversationsService(userId);
        res.status(200).json({conversations, message: 'Conversations fetched successfully'});
    } catch (e) {
        next(e);
    }
}


exports.getSpecific = async (req, res, next) => {
    try {
        const {firstUserId, secondUserId} = req.params;
        const conversation = await ConversationService.getSpecificConversationService(firstUserId, secondUserId);
        res.status(200).json({conversation, message: 'Conversation fetched successfully'});
    } catch (e) {
        next(e);
    }
}