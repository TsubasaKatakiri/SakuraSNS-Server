const mongoose = require('mongoose');

const GroupEventSchema = new mongoose.Schema({
    group: { type: mongoose.Schema.Types.ObjectId, ref: 'Group' },
    eventName: { type: String, default: '' },
    eventDate: { type: Date, default: null },
    eventDescription: { type: String, default: '' },
    eventLocation: { type: String, default: '' },
    eventImage:  { type: String, default: '' },
    participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
}, {
    timestamps: true,
})

module.exports = mongoose.model('GroupEvent', GroupEventSchema);