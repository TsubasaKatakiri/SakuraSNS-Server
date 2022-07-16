const mongoose = require('mongoose');

const checkPrivileges = (group, userId, actionLevel) => {
    let check = false;
    switch(actionLevel){
        case 'creator':
            check = (group.creator.toString() === userId);
            break;
        case "administrators":
            check = (group.administrators.includes(mongoose.Types.ObjectId(userId))
                    || group.creator.toString() === userId);
            break;
        case "moderators":
            check = (group.creator.toString() === userId 
                    || group.administrators.includes(mongoose.Types.ObjectId(userId))
                    || group.moderators.includes(mongoose.Types.ObjectId(userId)));
            break;
        default:
            check = group.members.includes(mongoose.Types.ObjectId(userId));
            break;
    }
    return check;
}

module.exports = checkPrivileges;