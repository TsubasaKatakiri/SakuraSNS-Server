const AuthService = require('../services/Auth.service');


exports.register = async (req, res, next) => {
    try {
        const {username, email, password} = req.body;
        const user = await AuthService.registerService(username, email, password)
        res.status(200).json({user: user, message: `Registration complete. An email is sent to ${email} for confirmation. Please, confirm the registration in the next 24 hours.`});
    } catch (e) {
        next(e)
    }
}


exports.activate = async (req, res, next) => {
    try {
        const activationToken = req.body.token;
        const user = await AuthService.activateService(activationToken);
        res.status(200).json({user: user, message: 'Account activation complete'});
    } catch (e) {
        next(e)
    }
}


exports.login = async (req, res, next) => {
    try {
        const {email, password}=req.body;
        const response = await AuthService.loginService(email, password)
        res.cookie('refreshToken', response.refreshToken, {
            httpOnly: true,
            maxAge: 30*24*60*60*1000,
        })
        res.status(200).json({user: response.user, message: 'Login successful'});
    } catch (e) {
        console.log(e);
        next(e)
    }
}


exports.refresh = (req, res, next) => {
    try {
        const refreshToken = req.cookies.refreshToken;
        const accessToken = AuthService.refreshService(refreshToken);
        res.status(200).json({accessToken});
    } catch (e) {
        next(e)
    }
}


exports.forgot = async (req, res, next) => {
    try {
        const {email} = req.body;
        const user = await AuthService.forgotService(email)
        res.status(200).json({user: user, message: `An email is sent to ${email} for confirmation`});
    } catch (e) {
        next(e)
    }
}


exports.reset = async (req, res, next) => {
    try {
        const {token, password} = req.body;
        const userData = await AuthService.resetService(token, password);
        res.status(200).json({user: userData, message: 'Password successfully changed'});
    } catch (e) {
        next(e)
    }
}


exports.logout = async (req, res, next) => {
    try {
        res.clearCookie('refreshToken');
        res.status(200).json({message: 'Logout successful'});
    } catch (e) {
        next(e);
    }
}
