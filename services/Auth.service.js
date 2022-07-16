const User = require ('../models/User');
const ContentPreferences = require ('../models/ContentPreferences');
const Album = require ('../models/ImageAlbum');
const bcrypt = require ('bcrypt');
const jwt = require ('jsonwebtoken');
const sendMail = require ('../util/sendMail');
const mongoose = require ('mongoose');
const APIError = require ('../middleware/apiErrors.middleware');
const { createActivationToken, createAccessToken, createRefreshToken } = require('../util/tokenFunctions');

const SALT_ROUNDS = 10;


exports.registerService = async (username, email, password) => {
    const emailCadidate = await User.findOne({email});
    if (emailCadidate) throw APIError.BadRequestError('User with this email or login already exists');
    const salt = await bcrypt.genSalt(SALT_ROUNDS);
    const hashedPassword = await bcrypt.hash(password, salt);
    const user = {username, email, password:hashedPassword};
    const activationToken = createActivationToken(user);
    const url = `${process.env.CLIENT_URL}/register-confirm/${activationToken}`;
    sendMail(email, url, 'verify your email and activate your account');
    return user;
}

exports.activateService = async (activationToken) => {
    const userData = jwt.verify(activationToken, process.env.JWT_ACTIVATION_SECRET);
    if(!userData) throw APIError.BadRequestError('Activation token is invalid. Check your activation token and try again');
    const {username, email, password} = userData;
    const emailCadidate = await User.findOne({email});
    if(emailCadidate) throw APIError.BadRequestError('User with this email or login already exists');
    const _id = new mongoose.Types.ObjectId();
    const user = await User.create({_id, username, email, password});
    const contentPreferences = await ContentPreferences.create({_id: new mongoose.Types.ObjectId(), user: new mongoose.Types.ObjectId(user._id)});
    const rootAlbum = await Album.create({name: 'Main album', 'albumSettings.isRootAlbum': true, owner: new mongoose.Types.ObjectId(user._id)});
    await User.findByIdAndUpdate(user._id, {
        contentPreferences: contentPreferences._id, 
        imageAlbums: new mongoose.Types.ObjectId(rootAlbum._id)
    });
    return user; 
}


exports.loginService = async (email, password) => {
    const user = await User.findOne({email});
    if(!user) throw APIError.BadRequestError('Incorrect username and/or password');
    const validPassword = await bcrypt.compare(password, user.password);
    if(!validPassword) throw APIError.BadRequestError('Incorrect username and/or password');
    const payload = {
        _id: user.id,
        login: user.login,
        email: user.email,
        password: user.password
    }
    const refreshToken = createRefreshToken(payload);
    return {user, refreshToken};
}


exports.forgotService = async (email) => {
    const user = await User.findOne({email});
    if(!user) throw APIError.BadRequestError('User does not exist');
    const accessToken = createAccessToken({id: user.id});
    const url = `${process.env.CLIENT_URL}/reset-password/${accessToken}`;
    sendMail(email, url, 'reset your password');
    return user;
}

exports.resetService = async (token, password) => {
    const userData = jwt.verify(token, process.env.JWT_ACCESS_SECRET)
    if(!userData) throw APIError.BadRequestError('Password reset token is invalid. Check your password reset token and try again');
    const {id} = userData;
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    await User.findByIdAndUpdate(id, {
        password: hashedPassword
    })
    return userData;
}

exports.refreshService = (refreshToken) => {
    if(!refreshToken) throw APIError.UnauthorizedError();
    const user = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET)
    if(!user) throw APIError.UnauthorizedError();
    const accessToken = createAccessToken({id: user._id});
    return accessToken;
}