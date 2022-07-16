const express = require('express');
const auth = require('../middleware/auth.middleware');
const VideoController = require ('../controllers/VideofileController')

const router = express.Router();

router.route('/').post(auth, VideoController.create);
router.route('/').get(auth, VideoController.getAll);
router.route('/group/:groupId').get(auth, VideoController.getGroupVideos);
router.route('/group/:groupId/add').post(auth, VideoController.addRemoveVideoToGroup);
router.route('/user/:userId').get(auth, VideoController.getUploadedByUser);
router.route('/:id').get(auth, VideoController.get);
router.route('/find').post(auth, VideoController.getSpecific);
router.route('/findTag').post(auth, VideoController.getVideosByTag);
router.route('/:id').put(auth, VideoController.edit);
router.route('/:id/delete').post(auth, VideoController.delete);
router.route('/:id/like').post(auth, VideoController.like);
router.route('/:id/dislike').post(auth, VideoController.dislike);
router.route('/:id/fav').post(auth, VideoController.setFavorite);
 
module.exports = router;