const express = require('express');
const auth = require('../middleware/auth.middleware');
const GroupInfoBlockController = require ('../controllers/GroupInfoBlockController');

const router = express.Router();

router.route('/:groupId').post(auth, GroupInfoBlockController.createGroupInfoBlock);
router.route('/:infoBlockId').get(auth, GroupInfoBlockController.getGroupInfoBlock);
router.route('/:groupId/all').get(auth, GroupInfoBlockController.getAllGroupInfoBlocks);
router.route('/:groupId/:infoBlockId/edit').put(auth, GroupInfoBlockController.editGroupInfoBlock);
router.route('/:groupId/:infoBlockId/delete').post(auth, GroupInfoBlockController.deleteGroupInfoBlock);

module.exports = router;