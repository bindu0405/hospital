// // server.js
// const express = require('express');
// const http = require('http');
// const WebSocket = require('ws');

// const app = express();
// const server = http.createServer(app);

// // Initialize WebSocket server
// const wss = new WebSocket.Server({ server });
// console.log(WebSocket, "00000000000000")
// // Handle WebSocket connections
// wss.on('connection', function connection(WebSocket) {
//     console.log('New client connected');

//     // Handle incoming messages from the client
//     WebSocket.on('message', function incoming(message) {
//         console.log('Received message from client:', message);
//         // Handle the received message as needed
//     });

//     // Handle errors on the WebSocket connection
//      WebSocket.on('error', function error(err) {
//         console.error('WebSocket connection error:', err.message);
//         // Handle the error gracefully
//     });

//     // Handle client disconnections
//      WebSocket.on('close', function close() {
//         console.log('Client disconnected');
//     });

//     // Emit event to the client
//     WebSocket.send('Hello, client!'); // This sends a message to the connected client
// });

// // Route for Socket.io (optional)
// app.get("/socket", (req, res) => {
//     res.send("<h1>Hey Socket.io!!</h1>");
// });

// server.listen(3000, () => {
//     console.log('WebSocket server running on port 3000');
// });


// server.js
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
//const redis = require("ioredis");

const cors = require("cors");

const app = express();
const server = http.createServer(app);
// Initialize Socket.io server
const io = socketIo(server);


// Handle Socket.io connections
io.on('connection', function connection(socket) {
    console.log('New client connected');
    
    // Handle incoming messages from the client
    socket.on('message', function (message) {
        console.log('Received message from client:', message);
        // Handle the received message as needed
    });


    // Handle client disconnections
    socket.on('disconnect', function () {
        console.log('Client disconnected');
    });
    

    // Emit event to the client
    socket.emit('hello', 'Hello, client!'); // This sends a message to the connected client
    
    console.log(connection(socket), "000")
    
});


// Route for Socket.io (optional)
app.get("/socket", (req, res) => {
    res.send("<h1>Hey Socket.io!!</h1>");
});

server.listen(3000, () => {
    console.log('Socket.io server running on port 3000');
});

