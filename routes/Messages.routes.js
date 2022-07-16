const express = require('express');
const auth = require('../middleware/auth.middleware');
const MessageController = require('../controllers/MessageController');

const router = express.Router();

router.route('/').post(auth, MessageController.create);
router.route('/:conversationId').get(auth, MessageController.getAll);
router.route('/delete/:messageId').post(auth, MessageController.deleteMessage);

module.exports = router;