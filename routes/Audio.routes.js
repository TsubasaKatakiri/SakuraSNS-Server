const express = require('express');
const auth = require('../middleware/auth.middleware');
const AudiofileController = require ('../controllers/AudiofileController')

const router = express.Router();

router.route('/').post(auth, AudiofileController.create);
router.route('/').get(auth, AudiofileController.getAll);
router.route('/group/:groupId').get(auth, AudiofileController.getGroupAudio);
router.route('/group/:groupId/add').post(auth, AudiofileController.addRemoveAudioToGroup);
router.route('/:audioId').get(auth, AudiofileController.getSingle);
router.route('/:id/fav').post(auth, AudiofileController.setFavorite);
router.route('/user/:userId').get(auth, AudiofileController.getUploadedByUser);
router.route('/find').post(auth, AudiofileController.getSpecific);
router.route('/:id').post(auth, AudiofileController.delete);
 
module.exports = router;