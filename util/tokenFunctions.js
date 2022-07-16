const jwt = require ('jsonwebtoken');

exports.createActivationToken = (payload) => {
    return jwt.sign(payload, process.env.JWT_ACTIVATION_SECRET, { expiresIn: "24h" });
}

exports.createAccessToken = (payload) => {
    return jwt.sign(payload, process.env.JWT_ACCESS_SECRET, { expiresIn: "24h" });
}

exports.createRefreshToken = (payload) => {
    return jwt.sign(payload, process.env.JWT_REFRESH_SECRET, { expiresIn: "30d" });
}