const Message = require('../models/Message');
const mongoose = require('mongoose');
const APIError = require('../middleware/apiErrors.middleware');


exports.createMessageService = async (conversationId, sender, attachments, text) => {
    const _id = new mongoose.Types.ObjectId();
    await Message.create({_id, conversationId, sender, attachments, text});
    const message = await Message.findById(_id).populate('attachments').populate('sender', '_id email username profilePicture');
    return message;
}


exports.getMessagesService = async (conversationId) => {
    const messages = await Message.find({conversationId}).sort({createdAt: 'asc'}).populate('attachments').populate('sender', '_id email username profilePicture');
    return messages;
}


exports.deleteMessageService = async (userId, messageId) => {
    const message = await Message.findById(messageId);
    console.log(message);
    if(message.sender.toString() !== userId) throw APIError.ForbiddenError();
    await message.deleteOne();
    return;
}