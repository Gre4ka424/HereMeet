# MeetHere – Dating & Meetup Web App

MeetHere is a full-stack web app for people to register, create a profile, find other users, chat, and arrange real-life meetups.

## 🛠️ Stack

- **Frontend**: React + Chakra UI
- **Backend**: Node.js + Express
- **Database**: PostgreSQL
- **Authentication**: JWT + bcrypt
- **Deployment**: Railway
- **ORM**: Prisma

## 📦 Features

- User registration/login
- User profiles with avatar, bio, preferences
- Filterable list of users
- Private 1-on-1 messaging
- Meetup scheduling
- Admin moderation dashboard

## 🚀 Setup

### 1. Clone the repository

```bash
git clone https://github.com/yourname/meethere.git
cd meethere
```

### 2. Install dependencies

```bash
# Установка зависимостей бэкенда
cd backend
npm install

# Установка зависимостей фронтенда
cd ../frontend
npm install
```

### 3. Set up environment variables

```bash
# В директории backend
cp .env.example .env
# Обновите DATABASE_URL и JWT_SECRET в файле .env

# В директории frontend
cp .env.example .env
```

### 4. Set up the database

```bash
# В директории backend
npx prisma migrate dev
```

### 5. Start development servers

```bash
# Запуск бэкенда в режиме разработки
cd backend
npm run dev

# Запуск фронтенда в режиме разработки
cd ../frontend
npm start
```

## 🐳 Using Docker

Запуск с помощью Docker:

```bash
# Сборка и запуск всех сервисов
docker-compose up -d

# Для запуска только базы данных
docker-compose up -d db
```

## 🚂 Deployment on Railway

Для деплоя на Railway:

1. Создайте новый проект на [Railway](https://railway.app/)
2. Подключите ваш GitHub репозиторий
3. Добавьте сервисы: PostgreSQL и два сервиса для бэкенда и фронтенда
4. Настройте переменные окружения для каждого сервиса
5. Запустите деплой

## 👥 Contributing

Contributions are welcome! Please feel free to submit a PR.
