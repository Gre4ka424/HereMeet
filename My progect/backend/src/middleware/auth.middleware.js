const jwt = require('jsonwebtoken');

/**
 * Middleware для проверки JWT токена
 */
const authMiddleware = (req, res, next) => {
  // Получаем токен из заголовка
  const token = req.header('Authorization')?.replace('Bearer ', '');

  // Проверяем, есть ли токен
  if (!token) {
    return res.status(401).json({ message: 'Требуется авторизация' });
  }

  try {
    // Верифицируем токен
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Неверный токен авторизации' });
  }
};

/**
 * Middleware для проверки прав администратора
 */
const adminMiddleware = async (req, res, next) => {
  try {
    // Проверяем, прошел ли пользователь авторизацию
    if (!req.user) {
      return res.status(401).json({ message: 'Требуется авторизация' });
    }

    // Проверяем, существует ли пользователь и является ли он админом
    const user = await prisma.user.findUnique({
      where: { id: req.user.id }
    });

    if (!user || !user.isAdmin) {
      return res.status(403).json({ message: 'Доступ запрещен. Требуются права администратора' });
    }

    next();
  } catch (error) {
    console.error('Ошибка при проверке прав администратора:', error);
    return res.status(500).json({ message: 'Внутренняя ошибка сервера' });
  }
};

module.exports = {
  authMiddleware,
  adminMiddleware
}; 