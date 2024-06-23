FROM node:20-alpine

RUN mkdir instaclone-reactapp

WORKDIR /instaclone-reactapp

COPY package*.json ./

COPY . .

ENV REACT_APP_API_URL "https://instagramclone-b5bg.onrender.com/"

RUN npm run build

EXPOSE 3000

CMD [ "npm", "start" ]