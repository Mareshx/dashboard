FROM node

WORKDIR /usr/app

COPY . ./

EXPOSE 8080

RUN npm install