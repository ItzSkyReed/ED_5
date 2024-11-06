FROM node:22-alpine3.19

WORKDIR /app/frontend/

COPY package*.json /app/frontend/
COPY package-lock.json /app/frontend/

RUN npm ci

COPY . /app/frontend/

RUN npm install typescript @types/react @types/react-dom --save-dev

CMD ["npm", "start"]