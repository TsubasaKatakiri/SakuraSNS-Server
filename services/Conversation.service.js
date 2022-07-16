const Conversation = require('../models/Conversation');
const mongoose = require('mongoose');


exports.createConversationService = async (senderId, receiverId) => {
    const existingConversation = await Conversation.findOne({members: {$all:[senderId, receiverId]}});
    let isCreated = false;
    if(!existingConversation){
        const _id = new mongoose.Types.ObjectId();
        await Conversation.create({_id, members: [senderId, receiverId]});
        const newConversation = await Conversation.findById(_id).populate('members', '_id email username profilePicture');
        isCreated = true;
        return {conversation: newConversation, isCreated};
    }
    return {conversation: existingConversation, isCreated};
}


exports.getAllConversationsService = async (userId) => {
    const conversations = await Conversation.find({members: {$in:[userId]}}).populate('members', '_id email username profilePicture');
    return conversations;
}


exports.getSpecificConversationService = async (firstUserId, secondUserId) => {
    const conversation = await Conversation.findOne({members: {$all:[firstUserId, secondUserId]}});;
    return conversation;
}