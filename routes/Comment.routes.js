const express = require('express');
const auth = require('../middleware/auth.middleware');
const CommentController = require ('../controllers/CommentController')

const router = express.Router();

router.route('/').post(auth, CommentController.create);
router.route('/:commentId').put(auth, CommentController.update);
router.route('/:commentId').post(auth, CommentController.delete);
router.route('/:entryId').get(auth, CommentController.getAll);
router.route('/:commentId/like').post(auth, CommentController.like);
router.route('/:commentId/dislike').post(auth, CommentController.dislike);
 
module.exports = router;