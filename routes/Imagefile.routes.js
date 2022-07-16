const express = require('express');
const auth = require('../middleware/auth.middleware');
const ImagefileController = require ('../controllers/ImageController')

const router = express.Router();

router.route('/').post(auth, ImagefileController.create);
router.route('/all/:albumId').get(auth, ImagefileController.getAll);
router.route('/single/:id').get(auth, ImagefileController.get);
router.route('/:id').put(auth, ImagefileController.modify);
router.route('/:id').post(auth, ImagefileController.deleteImage);
 
module.exports = router;