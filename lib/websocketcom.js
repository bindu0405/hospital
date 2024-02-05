const WebSocket = require('ws');
const http = require('http');
const express = require('express');
const app = express();

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

function setupWebSocketHandlers(socket) {
  // Send initial doctor status to the client
  socket.send(JSON.stringify({ status: 'offline' }));

  // Handle messages from clients
  socket.on('message', (message) => {
    try {
      const data = JSON.parse(message);

      // Update doctor status based on login state
      if (data.loginState === 'login') {
        isDoctorOnline = true;
      } else if (data.loginState === 'logout') {
        isDoctorOnline = false;
      }

      // Broadcast the updated status to all connected clients
      wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify({ status: isDoctorOnline ? 'online' : 'offline' }));
        }
      });
    } catch (error) {
      console.error('Error processing message:', error);
    }
  });

  // Handle errors
  socket.on('error', (error) => {
    console.error('WebSocket error:', error);
  });

  // Handle disconnection
  socket.on('close', () => {
    console.log('Client disconnected');
  });
}

wss.on('connection', (socket) => {
  setupWebSocketHandlers(socket);
});
module.exports=setupWebSocketHandlers;