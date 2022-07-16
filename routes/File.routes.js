const express = require('express');
const auth = require('../middleware/auth.middleware');
const FileController = require ('../controllers/FileController')

const router = express.Router();

router.route('/').post(auth, FileController.create);
router.route('/:id').get(auth, FileController.get);
router.route('/:id').post(auth, FileController.delete);
 
module.exports = router;