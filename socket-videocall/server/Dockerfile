FROM node:slim

WORKDIR /app

COPY package*.json /app

RUN npm install

COPY index.js /app/index.js
COPY app.js /app/app.js

EXPOSE 8000

CMD ["npm", "run", "start"]