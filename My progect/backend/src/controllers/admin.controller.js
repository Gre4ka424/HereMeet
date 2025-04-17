/**
 * Получение всех пользователей для админа
 */
const getAllUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      orderBy: {
        createdAt: 'desc'
      },
      select: {
        id: true,
        email: true,
        name: true,
        age: true,
        gender: true,
        location: true,
        bio: true,
        avatarUrl: true,
        isAdmin: true,
        createdAt: true,
        _count: {
          select: {
            sentMessages: true,
            receivedMessages: true,
            sentMeetups: true,
            receivedMeetups: true
          }
        }
      }
    });

    res.json(users);
  } catch (error) {
    console.error('Ошибка при получении пользователей:', error);
    res.status(500).json({ message: 'Внутренняя ошибка сервера' });
  }
};

/**
 * Удаление пользователя (только для админа)
 */
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = parseInt(id);

    // Проверяем, существует ли пользователь
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      return res.status(404).json({ message: 'Пользователь не найден' });
    }

    // Если пользователь админ, нельзя удалить
    if (user.isAdmin) {
      return res.status(403).json({ message: 'Нельзя удалить администратора' });
    }

    // Удаляем пользователя
    await prisma.user.delete({
      where: { id: userId }
    });

    res.json({ message: 'Пользователь успешно удален' });
  } catch (error) {
    console.error('Ошибка при удалении пользователя:', error);
    res.status(500).json({ message: 'Внутренняя ошибка сервера' });
  }
};

/**
 * Назначение пользователя администратором
 */
const promoteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = parseInt(id);

    // Проверяем, существует ли пользователь
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      return res.status(404).json({ message: 'Пользователь не найден' });
    }

    // Если пользователь уже админ
    if (user.isAdmin) {
      return res.status(400).json({ message: 'Пользователь уже является администратором' });
    }

    // Назначаем пользователя администратором
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { isAdmin: true },
      select: {
        id: true,
        email: true,
        name: true,
        isAdmin: true
      }
    });

    res.json(updatedUser);
  } catch (error) {
    console.error('Ошибка при назначении администратора:', error);
    res.status(500).json({ message: 'Внутренняя ошибка сервера' });
  }
};

module.exports = {
  getAllUsers,
  deleteUser,
  promoteUser
}; 