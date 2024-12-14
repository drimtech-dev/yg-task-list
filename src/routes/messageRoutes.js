const express = require('express');
const { getMessages, addMessage, deleteMessage } = require('../controllers/messageController');

const router = express.Router();

router.get('/', getMessages);
router.post('/', addMessage);
router.delete('/:id', deleteMessage);

module.exports = router;