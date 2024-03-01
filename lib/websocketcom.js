// const express = require('express');
// const http = require('http');
// const WebSocket = require('ws');
// const app = express();
//  const server = http.createServer(app);

// new WebSocket(app);
// const ws = new WebSocket.Server({server});
// console.log(ws, "------------")
// // WebSocket route
// app.get('/socket', (ws, req) => {
//     console.log('Client connected to WebSocket server');

//    // Event listener for when a client connects to the WebSocket server
// ws.on('connection', function connection(ws) {
//     console.log('Client connected');

//     // Emit a custom event after a delay
//     setTimeout(() => {
//         ws.emit('customEvent', 'This is a custom event!');
//     }, 2000);

//     // Event listener for when the client sends a message
//     ws.on('message', function incoming(message) {
//         console.log('Received message:', message);
//     });

//     // Event listener for when the client closes the connection
//     ws.on('close', function close() {
//         console.log('Client disconnected');
//     });
// });

// });

// const port = process.env.port || 3000;


// app.listen(port, () => {
//     console.log(`Server is running on port ${port}`);
// });
// server.js

