const { validationResult } = require('express-validator');

/**
 * Отправка сообщения
 */
const sendMessage = async (req, res) => {
  try {
    // Проверка валидации
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { receiverId, content } = req.body;
    const senderId = req.user.id;

    // Проверяем, существует ли получатель
    const receiver = await prisma.user.findUnique({
      where: { id: parseInt(receiverId) }
    });

    if (!receiver) {
      return res.status(404).json({ message: 'Получатель не найден' });
    }

    // Нельзя отправлять сообщения самому себе
    if (parseInt(receiverId) === senderId) {
      return res.status(400).json({ message: 'Нельзя отправлять сообщения самому себе' });
    }

    // Создаем сообщение
    const message = await prisma.message.create({
      data: {
        content,
        senderId,
        receiverId: parseInt(receiverId)
      }
    });

    res.status(201).json(message);
  } catch (error) {
    console.error('Ошибка при отправке сообщения:', error);
    res.status(500).json({ message: 'Внутренняя ошибка сервера' });
  }
};

/**
 * Получение чата между двумя пользователями
 */
const getChatWithUser = async (req, res) => {
  try {
    const currentUserId = req.user.id;
    const { userId } = req.params;
    const otherUserId = parseInt(userId);

    // Проверяем, существует ли другой пользователь
    const otherUser = await prisma.user.findUnique({
      where: { id: otherUserId }
    });

    if (!otherUser) {
      return res.status(404).json({ message: 'Пользователь не найден' });
    }

    // Получаем сообщения между двумя пользователями
    const messages = await prisma.message.findMany({
      where: {
        OR: [
          {
            senderId: currentUserId,
            receiverId: otherUserId
          },
          {
            senderId: otherUserId,
            receiverId: currentUserId
          }
        ]
      },
      orderBy: {
        createdAt: 'asc'
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            avatarUrl: true
          }
        },
        receiver: {
          select: {
            id: true,
            name: true,
            avatarUrl: true
          }
        }
      }
    });

    res.json(messages);
  } catch (error) {
    console.error('Ошибка при получении чата:', error);
    res.status(500).json({ message: 'Внутренняя ошибка сервера' });
  }
};

/**
 * Получение списка чатов пользователя
 */
const getUserChats = async (req, res) => {
  try {
    const currentUserId = req.user.id;

    // Получаем уникальные ID пользователей, с которыми есть переписка
    const sentMessages = await prisma.message.findMany({
      where: { senderId: currentUserId },
      select: { receiverId: true, createdAt: true }
    });

    const receivedMessages = await prisma.message.findMany({
      where: { receiverId: currentUserId },
      select: { senderId: true, createdAt: true }
    });

    // Объединяем ID в один массив
    const chatPartnerIds = new Set([
      ...sentMessages.map(msg => msg.receiverId),
      ...receivedMessages.map(msg => msg.senderId)
    ]);

    // Получаем информацию о пользователях
    const chats = await Promise.all(
      Array.from(chatPartnerIds).map(async (partnerId) => {
        const user = await prisma.user.findUnique({
          where: { id: partnerId },
          select: {
            id: true,
            name: true,
            avatarUrl: true
          }
        });

        // Находим последнее сообщение
        const lastMessage = await prisma.message.findFirst({
          where: {
            OR: [
              {
                senderId: currentUserId,
                receiverId: partnerId
              },
              {
                senderId: partnerId,
                receiverId: currentUserId
              }
            ]
          },
          orderBy: {
            createdAt: 'desc'
          },
          select: {
            content: true,
            createdAt: true,
            senderId: true
          }
        });

        return {
          user,
          lastMessage
        };
      })
    );

    // Сортируем чаты по времени последнего сообщения (от нового к старому)
    chats.sort((a, b) => 
      new Date(b.lastMessage?.createdAt || 0) - new Date(a.lastMessage?.createdAt || 0)
    );

    res.json(chats);
  } catch (error) {
    console.error('Ошибка при получении списка чатов:', error);
    res.status(500).json({ message: 'Внутренняя ошибка сервера' });
  }
};

module.exports = {
  sendMessage,
  getChatWithUser,
  getUserChats
}; 