const express = require('express');
const auth = require('../middleware/auth.middleware');
const ContentPreferencesController = require ('../controllers/ContentPreferencesController')

const router = express.Router();

router.route('/:userId/get').get(auth, ContentPreferencesController.get);
router.route('/:userId/audio').get(auth, ContentPreferencesController.getFavoriteMusic);
router.route('/:userId/video').get(auth, ContentPreferencesController.getFavoriteVideo);
router.route('/:userId/audio/favs').put(auth, ContentPreferencesController.changeAudioFavorites);
router.route('/:userId/video/favs').put(auth, ContentPreferencesController.changeVideoFavorites);
router.route('/:userId/video/search').put(auth, ContentPreferencesController.updateSearchHistory);
router.route('/:userId/video/tags').put(auth, ContentPreferencesController.updateVideoTags);
router.route('/:userId/audio/clear-favs').post(auth, ContentPreferencesController.clearAudioFavorites);
router.route('/:userId/video/clear-favs').post(auth, ContentPreferencesController.changeVideoFavorites);
router.route('/:userId/video/clear-recommends').post(auth, ContentPreferencesController.clearVideoRecommendations);
 
module.exports = router;