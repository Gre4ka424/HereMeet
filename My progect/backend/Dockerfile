FROM node:18-alpine

WORKDIR /usr/src/app

# Копируем package.json и package-lock.json
COPY package*.json ./

# Устанавливаем зависимости
RUN npm install

# Копируем prisma схему
COPY prisma ./prisma/

# Генерируем Prisma клиент
RUN npx prisma generate

# Копируем исходный код
COPY . .

# Открываем порт
EXPOSE 5000

# Команда для запуска приложения
CMD ["npm", "start"] 