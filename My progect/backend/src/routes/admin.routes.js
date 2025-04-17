const express = require('express');
const adminController = require('../controllers/admin.controller');
const { authMiddleware, adminMiddleware } = require('../middleware/auth.middleware');

const router = express.Router();

// Все маршруты требуют аутентификации и прав администратора
router.use(authMiddleware, adminMiddleware);

// Получение всех пользователей
router.get('/users', adminController.getAllUsers);

// Удаление пользователя
router.delete('/users/:id', adminController.deleteUser);

// Назначение пользователя администратором
router.put('/users/:id/promote', adminController.promoteUser);

module.exports = router; 