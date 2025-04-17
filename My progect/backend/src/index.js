const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');
const { PrismaClient } = require('@prisma/client');

// Импорт роутов
const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes');
const messageRoutes = require('./routes/message.routes');
const meetupRoutes = require('./routes/meetup.routes');
const adminRoutes = require('./routes/admin.routes');

// Загрузка переменных окружения
dotenv.config();

// Инициализация Prisma клиента
const prisma = new PrismaClient();
global.prisma = prisma;

// Создание Express приложения
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Роуты
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/meetups', meetupRoutes);
app.use('/api/admin', adminRoutes);

// Базовый роут
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to MeetHere API!' });
});

// Обработка ошибок
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  console.error(err.message, err.stack);
  res.status(statusCode).json({ 
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? '🥞' : err.stack 
  });
});

// Запуск сервера
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Graceful shutdown
process.on('SIGINT', async () => {
  await prisma.$disconnect();
  console.log('Database connection closed');
  process.exit(0);
}); 