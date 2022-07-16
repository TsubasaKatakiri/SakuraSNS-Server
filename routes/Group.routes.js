const express = require('express');
const auth = require('../middleware/auth.middleware');
const GroupController = require ('../controllers/GroupController');

const router = express.Router();

router.route('/').post(auth, GroupController.createGroup);
router.route('/:groupId').get(auth, GroupController.getGroup);
router.route('/search').post(auth, GroupController.getGroupsByConditions);
router.route('/search/:userId').post(auth, GroupController.getUserGroupsByConditions);
router.route('/:groupId/edit/info').put(auth, GroupController.editGroupInfo);
router.route('/:groupId/edit/policies').put(auth, GroupController.editGroupPolicies);
router.route('/:groupId/delete').post(auth, GroupController.deleteGroup);
router.route('/:groupId/join').post(auth, GroupController.joinToGroup);
router.route('/:groupId/join/request').post(auth, GroupController.processJoinRequest);
router.route('/:groupId/ban').post(auth, GroupController.banUser);
router.route('/:groupId/level').post(auth, GroupController.levelUser);
router.route('/:groupId/leave').post(auth, GroupController.leaveGroup);
router.route('/:groupId/users').post(GroupController.getAllGroupUsers);
router.route('/:groupId/users/ban').post(GroupController.getBannedGroupUsers);
router.route('/:groupId/users/request').post(GroupController.getGroupRequests);
router.route('/:groupId/audio/add').post(GroupController.addAudio);
router.route('/:groupId/audio/delete').post(GroupController.removeAudio);
 
module.exports = router;