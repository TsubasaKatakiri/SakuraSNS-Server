const express = require('express');
const auth = require('../middleware/auth.middleware');
const ConversationController = require('../controllers/ConversationController');

const router = express.Router();


router.route('/').post(auth, ConversationController.create);
router.route('/:userId').get(auth, ConversationController.getAll);
router.route('/:firstUserId/:secondUserId').get(auth, ConversationController.getSpecific);
 
module.exports = router;