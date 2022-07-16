const express = require('express');

const router = express.Router();

router.use('/auth', require('./Auth.routes'));
router.use('/user', require('./User.routes'));
router.use('/conversations', require('./Conversations.routes'));
router.use('/messages', require('./Messages.routes'));
router.use('/audio', require('./Audio.routes'));
router.use('/post', require('./Post.routes'));
router.use('/comment', require('./Comment.routes'));
router.use('/video', require('./Videofile.routes'));
router.use('/album', require('./ImageAlbum.routes'));
router.use('/image', require('./Imagefile.routes'));
router.use('/file', require('./File.routes'));
router.use('/prefs', require('./ContentPreferences.routes'));
router.use('/group', require('./Group.routes'));
router.use('/groupDiscussion', require('./GroupDiscussion.routes'));
router.use('/groupEvent', require('./GroupEvents.routes'));
router.use('/groupInfo', require('./GroupInfoBlock.routes'));


module.exports = router;