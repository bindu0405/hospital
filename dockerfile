FROM node:14

WORKDIR /server

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3000    
EXPOSE 3001     

CMD ["node", "server.js"]
