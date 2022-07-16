const express = require('express');
const auth = require('../middleware/auth.middleware');
const GroupEventController = require ('../controllers/GroupEventController');

const router = express.Router();

router.route('/:groupId').post(auth, GroupEventController.createGroupEvent);
router.route('/:groupEventId').get(auth, GroupEventController.getGroupEvent);
router.route('/:groupId/allEvents').get(auth, GroupEventController.getAllGroupEvents);
router.route('/:groupId/:groupEventId/join').put(auth, GroupEventController.joinGroupEvent);
router.route('/:groupId/:groupEventId/edit').put(auth, GroupEventController.editGroupEvent);
router.route('/:groupId/:groupEventId/delete').post(auth, GroupEventController.deleteGroupEvent);

module.exports = router;