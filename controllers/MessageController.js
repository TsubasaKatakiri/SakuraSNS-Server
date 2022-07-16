const MessageService = require('../services/Message.service');


exports.create = async (req, res, next) => {
    try {
        const {conversationId, sender, attachments, text} = req.body;
        const savedMessage = await MessageService.createMessageService(conversationId, sender, attachments, text);
        res.status(201).json({msg: savedMessage, message: 'Message created successfully'})
    } catch (e) {
        next(e);
    }
}


exports.getAll = async (req, res, next) => {
    try {
        const conversationId = req.params.conversationId;
        const messages = await MessageService.getMessagesService(conversationId);
        res.status(200).json({messages, message: 'Messages fetched successfully'});
    } catch (e) {
        next(e);
    }
}


exports.deleteMessage = async (req, res, next) => {
    try {
        const userId = req.body.userId;
        const messageId = req.params.messageId;
        await MessageService.deleteMessageService(userId, messageId);
        res.status(200).json({message: 'Message deleted successfully'});
    } catch (e) {
        next(e);
    }
}