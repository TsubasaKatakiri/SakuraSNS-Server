const mongoose = require('mongoose');

const UserAdditionalDataSchema = new mongoose.Schema({
    _id: {type: mongoose.Schema.Types.ObjectId, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    city: { type: String, default: '' },
    country: { type: String, default: '' },
    school: { type: String, default: '' },
    university: { type: String, default: '' },
    company: { type: String, default: '' },
    gender: { type: String, default: '' },
    currentStatus: { type: String, default: '' },
    aboutMe: { type: String, default: '' },
    hobbies: { type: String, default: '' },
    likes: { type: String, default: '' },
    dislikes: { type: String, default: '' },
}, {
    timestamps: true,
});

module.exports = mongoose.model('UserAdditionalData', UserAdditionalDataSchema);