const mongoose = require('mongoose');

const AlbumSettingsSchema = new mongoose.Schema({
    isRootAlbum: { type: Boolean, default: false },
    isGroupAlbum: { type: Boolean, default: false },
    isUserPrivate: { type: Boolean, default: false },
    isGroupPrivate: { type: Boolean, default: false },
    isGroupLocked: { type: Boolean, default: false },
})

const AlbumSchema = new mongoose.Schema({
    name: { type: String, required: true },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    images: [ {type: mongoose.Schema.Types.ObjectId, ref: 'Imagefile' } ],
    groupId: { type: mongoose.Schema.Types.ObjectId, ref: 'Group' },
    lastImage: { type: mongoose.Schema.Types.ObjectId, ref: 'Imagefile' },
    albumSettings: {type: AlbumSettingsSchema}
}, {
    timestamps: true,
});

module.exports = mongoose.model('Album', AlbumSchema);