module.exports = class APIError extends Error{
    constructor(status, message, errors=[]){
        super(message);
        this.status = status;
        this.errors = errors;
    }

    static UnauthorizedError(){
        return new APIError(401, "User is Not Authorized");
    }

    static ForbiddenError(){
        return new APIError(403, "Forbidden");
    }

    static BadRequestError(message, errors){
        return new APIError(400, message, errors);
    }
}
