const express = require('express');
const auth = require('../middleware/auth.middleware');
const ImageAlbumController = require('../controllers/ImageAlbumController');

const router = express.Router();

router.route('/').post(auth, ImageAlbumController.create);
router.route('/:user').get(auth, ImageAlbumController.getAll);
router.route('/group/:groupId/').get(auth, ImageAlbumController.getAllOfGroup);
router.route('/user/:id/').get(auth, ImageAlbumController.get);
router.route('/group/:albumId/').post(auth, ImageAlbumController.getOneOfGroup);
router.route('/:id').put(auth, ImageAlbumController.update);
router.route('/:id/lock').put(auth, ImageAlbumController.lock);
router.route('/:id/private').put(auth, ImageAlbumController.private);
router.route('/:albumId/preserve').post(auth, ImageAlbumController.deletePreserve);
router.route('/:albumId/full').post(auth, ImageAlbumController.deleteFull);

 
module.exports = router;