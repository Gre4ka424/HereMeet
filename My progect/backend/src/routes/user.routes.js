const express = require('express');
const { check } = require('express-validator');
const userController = require('../controllers/user.controller');
const { authMiddleware } = require('../middleware/auth.middleware');

const router = express.Router();

// Все маршруты требуют аутентификации
router.use(authMiddleware);

// Получение всех пользователей с фильтрацией
router.get('/', userController.getAllUsers);

// Получение профиля пользователя по ID
router.get('/:id', userController.getUserById);

// Обновление профиля пользователя
router.put('/:id', [
  check('name', 'Имя обязательно').optional().notEmpty(),
  check('age', 'Возраст должен быть числом от 18 до 100').optional().isInt({ min: 18, max: 100 }),
  check('gender', 'Укажите корректный пол').optional().isIn(['male', 'female', 'other']),
  check('location', 'Укажите местоположение').optional().notEmpty(),
  check('bio', 'Биография слишком длинная').optional().isLength({ max: 1000 }),
  check('avatarUrl', 'Некорректная ссылка на аватар').optional().isURL()
], userController.updateUser);

module.exports = router; 