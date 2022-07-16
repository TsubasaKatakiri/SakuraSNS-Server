const express = require('express');
const AuthController = require('../controllers/AuthController');
const auth = require('../middleware/auth.middleware');

const router = express.Router();

router.route('/register').post(AuthController.register);
router.route('/activate').post(AuthController.activate);
router.route('/login').post(AuthController.login);
router.route('/refresh').post(AuthController.refresh);
router.route('/forgot').post(AuthController.forgot);
router.route('/logout').get(AuthController.logout);
router.route('/reset').post(auth, AuthController.reset);


module.exports = router;