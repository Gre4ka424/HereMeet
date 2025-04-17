const express = require('express');
const { check } = require('express-validator');
const authController = require('../controllers/auth.controller');
const { authMiddleware } = require('../middleware/auth.middleware');

const router = express.Router();

// Регистрация пользователя
router.post(
  '/register',
  [
    check('email', 'Пожалуйста, введите корректный email').isEmail(),
    check('password', 'Пароль должен быть не менее 6 символов').isLength({ min: 6 }),
    check('name', 'Имя обязательно').notEmpty(),
    check('age', 'Возраст должен быть числом от 18 до 100').isInt({ min: 18, max: 100 }),
    check('gender', 'Укажите пол').isIn(['male', 'female', 'other']),
    check('location', 'Укажите местоположение').notEmpty()
  ],
  authController.register
);

// Вход пользователя
router.post(
  '/login',
  [
    check('email', 'Пожалуйста, введите корректный email').isEmail(),
    check('password', 'Пароль обязателен').notEmpty()
  ],
  authController.login
);

// Получение информации о текущем пользователе
router.get('/me', authMiddleware, authController.getMe);

module.exports = router; 