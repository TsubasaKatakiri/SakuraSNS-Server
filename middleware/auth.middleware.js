const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {
    try {
        const token = req.header("Authorization");
        if(!token) return res.status(401).json({message: "Unauthorized"});
        jwt.verify(token, process.env.JWT_ACCESS_SECRET, (err, user) => {
            if(err) return res.status(401).json({message: "Unauthorized"});
            req.user = user;
            next();
        })
    } catch(e) {
        return res.status(500).json({message: e.message});
    }
}

module.exports = auth;