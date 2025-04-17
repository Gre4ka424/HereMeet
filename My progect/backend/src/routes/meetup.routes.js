const express = require('express');
const { check } = require('express-validator');
const meetupController = require('../controllers/meetup.controller');
const { authMiddleware } = require('../middleware/auth.middleware');

const router = express.Router();

// Все маршруты требуют аутентификации
router.use(authMiddleware);

// Создание встречи
router.post(
  '/',
  [
    check('receiverId', 'ID получателя обязателен').notEmpty(),
    check('date', 'Дата обязательна и должна быть в будущем').isISO8601().custom((value) => {
      if (new Date(value) <= new Date()) {
        throw new Error('Дата должна быть в будущем');
      }
      return true;
    }),
    check('location', 'Укажите место встречи').notEmpty().isLength({ max: 200 })
  ],
  meetupController.createMeetup
);

// Получение всех встреч пользователя
router.get('/', meetupController.getUserMeetups);

// Обновление статуса встречи
router.put(
  '/:id',
  [
    check('status', 'Статус должен быть accepted или declined').isIn(['accepted', 'declined'])
  ],
  meetupController.updateMeetupStatus
);

module.exports = router; 