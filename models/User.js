const mongoose = require('mongoose');

const UserSchemaOptions = { timestamps: true, toJSON: { virtuals: true } };

const UserSettings = new mongoose.Schema({
    userRole: { type: String, default: 'user' },
    isBanned: { type: Boolean, default: false },
    isDarkMode: { type: Boolean, default: false },
    canAcceptMessages: { type: String, default: 'all' },
    canAccessPage: { type: String, default: 'all' },
    canAccessMusic: { type: String, default: 'all' },
    canAccessVideos: { type: String, default: 'all' },
    canAccessAlbums: { type: String, default: 'all' },
    canAccessFollowers: { type: String, default: 'all' },
    canAccessFollowings: { type: String, default: 'all' },
    canAccessGroups: { type: String, default: 'all' },
})

const ExtraDataSchema = new mongoose.Schema({
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
})

const UserSchema = new mongoose.Schema({
    login: { type: String, min: 3, max: 64, trim: true},
    email: { type: String, required: [true, 'Please enter your email'], min: 4, max: 128, unique: true, trim: true},
    password: { type: String, required: [true, 'Please enter your password'], min: 6},
    username: { type: String, max: 256, default: '' },
    role: { type: Number, default: 0 },
    profilePicture: { type: String, default: '' },
    coverPicture: { type: String, default: '' },
    status: { type: String, default: '' },
    birthdayDate: { type: Date, default: null },
    description: { type: String, default: '', max: 512 },
    followers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    followings: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    blacklist: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    groups: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Group' }],
    groupRequests: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Group' }],
    groupBans: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Group' }],
    additionalData: { type: mongoose.Schema.Types.ObjectId, ref: 'UserAdditionalData' },
    contentPreferences: { type: mongoose.Schema.Types.ObjectId, ref: 'ContentPreferences' },
    imageAlbums: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Album' }],
    extraData: { type: ExtraDataSchema },
    userSettings: { type: UserSettings },
}, UserSchemaOptions)

const userAgeVirtual = UserSchema.virtual('age');

userAgeVirtual.get(function(){
    return Math.abs(new Date(new Date() - new Date(this.birthdayDate)).getUTCFullYear() - 1970);
})

const userFirstNameVirtual = UserSchema.virtual('firstName');

userFirstNameVirtual.get(function(){
    return this.username.split(" ")[0];
})

const userLastNameVirtual = UserSchema.virtual('lastName');

userLastNameVirtual.get(function(){
    const nameArray=this.username.split(' ');
    return nameArray[nameArray.length - 1];
})

module.exports = mongoose.model('User', UserSchema);