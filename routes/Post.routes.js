const express = require('express');
const auth = require('../middleware/auth.middleware');
const PostController = require ('../controllers/PostController');

const router = express.Router();

router.route('/').post(auth, PostController.create);
router.route('/:postId').put(auth, PostController.update);
router.route('/:postId').post(auth, PostController.delete);
router.route('/:postId/like').post(auth, PostController.like);
router.route('/:postId/dislike').post(auth, PostController.dislike);
router.route('/:postId').get(auth, PostController.get);
router.route('/profile/:userId').get(auth, PostController.getAll);
router.route('/feed/tag').post(auth, PostController.getByTag);
router.route('/feed/:userId').get(auth, PostController.getFeed);
router.route('/group/:groupId').get(auth, PostController.getGroupFeed);
 
module.exports = router;