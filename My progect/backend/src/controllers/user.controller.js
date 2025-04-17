const { validationResult } = require('express-validator');

/**
 * Получение всех пользователей с фильтрацией
 */
const getAllUsers = async (req, res) => {
  try {
    const { gender, minAge, maxAge, location } = req.query;
    
    // Создаем фильтр на основе параметров запроса
    const filter = {
      id: { not: req.user.id } // Исключаем текущего пользователя
    };
    
    // Добавляем фильтры, если они указаны
    if (gender) {
      filter.gender = gender;
    }
    
    if (minAge || maxAge) {
      filter.age = {};
      if (minAge) filter.age.gte = parseInt(minAge);
      if (maxAge) filter.age.lte = parseInt(maxAge);
    }
    
    if (location) {
      filter.location = { contains: location, mode: 'insensitive' };
    }
    
    // Получаем пользователей с применением фильтров
    const users = await prisma.user.findMany({
      where: filter,
      select: {
        id: true,
        name: true,
        age: true,
        gender: true,
        location: true,
        bio: true,
        avatarUrl: true,
        createdAt: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
    
    res.json(users);
  } catch (error) {
    console.error('Ошибка при получении пользователей:', error);
    res.status(500).json({ message: 'Внутренняя ошибка сервера' });
  }
};

/**
 * Получение профиля пользователя по ID
 */
const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const user = await prisma.user.findUnique({
      where: { id: parseInt(id) },
      select: {
        id: true,
        name: true,
        age: true,
        gender: true,
        location: true,
        bio: true,
        avatarUrl: true,
        createdAt: true
      }
    });
    
    if (!user) {
      return res.status(404).json({ message: 'Пользователь не найден' });
    }
    
    res.json(user);
  } catch (error) {
    console.error('Ошибка при получении профиля пользователя:', error);
    res.status(500).json({ message: 'Внутренняя ошибка сервера' });
  }
};

/**
 * Обновление профиля пользователя
 */
const updateUser = async (req, res) => {
  try {
    // Проверка валидации
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    const { id } = req.params;
    const { name, age, gender, location, bio, avatarUrl } = req.body;
    
    // Проверяем права доступа (пользователь может редактировать только свой профиль)
    if (parseInt(id) !== req.user.id) {
      return res.status(403).json({ message: 'Доступ запрещен' });
    }
    
    // Обновляем профиль
    const updatedUser = await prisma.user.update({
      where: { id: parseInt(id) },
      data: {
        name,
        age,
        gender,
        location,
        bio,
        avatarUrl
      },
      select: {
        id: true,
        name: true,
        email: true,
        age: true,
        gender: true,
        location: true,
        bio: true,
        avatarUrl: true,
        updatedAt: true
      }
    });
    
    res.json(updatedUser);
  } catch (error) {
    console.error('Ошибка при обновлении профиля:', error);
    res.status(500).json({ message: 'Внутренняя ошибка сервера' });
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  updateUser
}; 