FROM node:18-alpine as build

WORKDIR /usr/src/app

# Копируем package.json и package-lock.json
COPY package*.json ./

# Устанавливаем зависимости
RUN npm install

# Копируем исходный код
COPY . .

# Создаем production build
RUN npm run build

# Вторая стадия - только для запуска приложения
FROM nginx:stable-alpine

# Копируем билд из предыдущей стадии
COPY --from=build /usr/src/app/build /usr/share/nginx/html

# Копируем настройки nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Открываем порт
EXPOSE 3000

CMD ["nginx", "-g", "daemon off;"] 