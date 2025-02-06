FROM node:slim

WORKDIR /app

COPY package*.json /app

RUN npm install

COPY app.js /app/app.js
COPY index.js /app/index.js

EXPOSE 8000

CMD ["npm", "run", "start"]