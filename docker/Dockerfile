FROM node

WORKDIR /home/bitespeed-assignment

COPY package.json package.json
RUN npm install
COPY . .

CMD [ "npm","run","dev" ]