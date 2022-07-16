const express = require('express');
const UserController = require('../controllers/UserController');
const auth = require('../middleware/auth.middleware');

const router = express.Router();

router.route('/userinfo').get(auth, UserController.userInfo);
router.route('/:id').get(auth, UserController.findUser);
router.route('/search').post(auth, UserController.searchUsers);
router.route('/searchAdvanced').post(UserController.searchUsersAdvanced);
router.route('/:userId/extra').put(UserController.modifyExtraData);
router.route('/:userId/settings').put(UserController.modifyUserSettings);
router.route('/:id/dark').put(auth, UserController.toggleDarkMode);
router.route('/:id/status').put(auth, UserController.changeUserStatus);
router.route('/:id').put(auth, UserController.modifyUser);
router.route('/:id/password').put(auth, UserController.modifyUserPassword);
router.route('/:id/friends').get(auth, UserController.userFriends);
router.route('/:id/groups').post(auth, UserController.userGroups);
router.route('/:id/friends/advanced').post(auth, UserController.searchFriendsAdvanced);
router.route('/:id/followers/advanced').post(auth, UserController.searchFollowersAdvanced);
router.route('/:id/follow').put(auth, UserController.followUser);
router.route('/:userId/blacklist').post(UserController.blacklistUser);
router.route('/:userId/blacklist').get(UserController.getBlacklistedUsers);
router.route('/:id/promote').post(auth, UserController.promoteUser);
router.route('/:id/ban').post(auth, UserController.banUser);

 
module.exports = router;