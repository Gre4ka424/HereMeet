const { validationResult } = require('express-validator');

/**
 * Создание встречи
 */
const createMeetup = async (req, res) => {
  try {
    // Проверка валидации
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { receiverId, date, location } = req.body;
    const initiatorId = req.user.id;

    // Проверяем, существует ли получатель
    const receiver = await prisma.user.findUnique({
      where: { id: parseInt(receiverId) }
    });

    if (!receiver) {
      return res.status(404).json({ message: 'Получатель не найден' });
    }

    // Нельзя назначать встречу самому себе
    if (parseInt(receiverId) === initiatorId) {
      return res.status(400).json({ message: 'Нельзя назначать встречу самому себе' });
    }

    // Создаем встречу
    const meetup = await prisma.meetup.create({
      data: {
        date: new Date(date),
        location,
        status: 'pending',
        initiatorId,
        receiverId: parseInt(receiverId)
      },
      include: {
        initiator: {
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

    res.status(201).json(meetup);
  } catch (error) {
    console.error('Ошибка при создании встречи:', error);
    res.status(500).json({ message: 'Внутренняя ошибка сервера' });
  }
};

/**
 * Получение всех встреч пользователя
 */
const getUserMeetups = async (req, res) => {
  try {
    const userId = req.user.id;

    // Получаем все встречи, где пользователь является инициатором или получателем
    const meetups = await prisma.meetup.findMany({
      where: {
        OR: [
          { initiatorId: userId },
          { receiverId: userId }
        ]
      },
      orderBy: {
        date: 'asc'
      },
      include: {
        initiator: {
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

    // Разделяем встречи на исходящие, входящие и прошедшие
    const now = new Date();
    const outgoing = [];
    const incoming = [];
    const past = [];

    meetups.forEach(meetup => {
      const meetupDate = new Date(meetup.date);
      // Проверяем, прошла ли встреча
      if (meetupDate < now) {
        past.push(meetup);
      } else if (meetup.initiatorId === userId) {
        outgoing.push(meetup);
      } else {
        incoming.push(meetup);
      }
    });

    res.json({
      outgoing,
      incoming,
      past
    });
  } catch (error) {
    console.error('Ошибка при получении встреч:', error);
    res.status(500).json({ message: 'Внутренняя ошибка сервера' });
  }
};

/**
 * Обновление статуса встречи
 */
const updateMeetupStatus = async (req, res) => {
  try {
    // Проверка валидации
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const { status } = req.body;
    const userId = req.user.id;

    // Проверяем, существует ли встреча
    const meetup = await prisma.meetup.findUnique({
      where: { id: parseInt(id) }
    });

    if (!meetup) {
      return res.status(404).json({ message: 'Встреча не найдена' });
    }

    // Только получатель может изменить статус встречи
    if (meetup.receiverId !== userId) {
      return res.status(403).json({ message: 'Вы не можете изменить статус этой встречи' });
    }

    // Проверяем, не прошла ли встреча
    const meetupDate = new Date(meetup.date);
    const now = new Date();
    if (meetupDate < now) {
      return res.status(400).json({ message: 'Нельзя изменить статус прошедшей встречи' });
    }

    // Обновляем статус встречи
    const updatedMeetup = await prisma.meetup.update({
      where: { id: parseInt(id) },
      data: { status },
      include: {
        initiator: {
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

    res.json(updatedMeetup);
  } catch (error) {
    console.error('Ошибка при обновлении статуса встречи:', error);
    res.status(500).json({ message: 'Внутренняя ошибка сервера' });
  }
};

module.exports = {
  createMeetup,
  getUserMeetups,
  updateMeetupStatus
}; 