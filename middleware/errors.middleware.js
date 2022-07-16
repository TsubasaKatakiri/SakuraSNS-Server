const APIError = require("./apiErrors.middleware");

module.exports = (err, req, res, next) => {
    const response = { errorCode: err.status, message: err.message, errors: err.errors}
    if(err instanceof APIError){
        return res.status(err.status).json({response});
    }
    return res.status(500).json({
        errorCode: 500, 
        message: "Internal Server Error"
    })
}