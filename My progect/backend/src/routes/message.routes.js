const express = require('express');
const { check } = require('express-validator');
const messageController = require('../controllers/message.controller');
const { authMiddleware } = require('../middleware/auth.middleware');

const router = express.Router();

// Все маршруты требуют аутентификации
router.use(authMiddleware);

// Отправка сообщения
router.post(
  '/',
  [
    check('receiverId', 'ID получателя обязателен').notEmpty(),
    check('content', 'Текст сообщения обязателен').notEmpty().isLength({ max: 500 })
  ],
  messageController.sendMessage
);

// Получение чата с конкретным пользователем
router.get('/:userId', messageController.getChatWithUser);

// Получение списка чатов пользователя
router.get('/', messageController.getUserChats);

module.exports = router; 