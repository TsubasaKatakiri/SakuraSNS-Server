const mongoose = require('mongoose');

const GroupPolicySchema = new mongoose.Schema({
    isPrivate: { type: Boolean, default: false },
    isFreeJoin: { type: Boolean, default: true },
    canEditGroupInfo: { type: String, default: 'moderators' },
    canEditGroupPolicies: { type: String, default: 'creator' },
    canDeleteGroup: { type: String, default: 'creator' },
    canUpdateUserLevels: { type: String, default: 'administrators' },
    canDeleteDiscussions: { type: String, default: 'moderators' },
    canBanUsers: { type: String, default: 'moderators' },
    canAcceptJoinRequests: { type: String, default: 'moderators' },
    canDeletePosts: { type: String, default: 'moderators' },
    canSetEvents: { type: String, default: 'moderators' },
    canCreatePosts: { type: String, default: 'all' },
    canCreateDiscussions: { type: String, default: 'all' },
    canCreateAlbums: { type: String, default: 'all' },
    canUploadFiles: { type: String, default: 'all' },
})

const GroupSchema = new mongoose.Schema({
    groupname: { type: String, required: true, max: 512 },
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    creator: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    administrators: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    moderators: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    bans: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    joinRequests: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    groupFriends: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Group' }],
    profilePicture: { type: String, default: '' },
    coverPicture: { type: String, default: '' },
    theme: { type: String, default: '' },
    description: { type: String, default: '', max: 4096 },
    groupCity: { type: String, default: '' },
    groupCountry: { type: String, default: '' },
    groupInfo: [{ type: mongoose.Schema.Types.ObjectId, ref: 'GroupInfoBlock' }],
    groupDiscussions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'GroupDiscussion' }],
    groupEvents: [{ type: mongoose.Schema.Types.ObjectId, ref: 'GroupEvent' }],
    groupLinks: { type: Array, default: [] },
    videos: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Videofile' }],
    imageAlbums: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Album' }],
    music: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Audiofile' }],
    posts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }],
    policies: { type: GroupPolicySchema },
}, {
    timestamps: true,
})

module.exports = mongoose.model('Group', GroupSchema);