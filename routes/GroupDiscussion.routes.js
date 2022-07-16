const express = require('express');
const auth = require('../middleware/auth.middleware');
const GroupDiscussionController = require ('../controllers/GroupDiscussionController');

const router = express.Router();

router.route('/:groupId').post(auth, GroupDiscussionController.createGroupDiscussion);
router.route('/:groupId/:discussionId').post(auth, GroupDiscussionController.getGroupDiscussion);
router.route('/:groupId').get(auth, GroupDiscussionController.getAllGroupDiscussions);
router.route('/:groupId/:discussionId/close').put(auth, GroupDiscussionController.closeGroupDiscussion);
router.route('/:groupId/:discussionId/hide').put(auth, GroupDiscussionController.hideGroupDiscussion);
router.route('/:groupId/:discussionId/delete').post(auth, GroupDiscussionController.deleteGroupDiscussion);
router.route('/:groupId/:discussionId/post').post(auth, GroupDiscussionController.createGroupDiscussionPost);
router.route('/:groupId/:discussionId/getAll').post(auth, GroupDiscussionController.getGroupDiscussionPosts);
router.route('/:groupId/:discussionId/:postId/delete').post(auth, GroupDiscussionController.deleteGroupDiscussionPost);

module.exports = router;