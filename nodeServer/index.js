const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');

const PORT = 8000;

// Create Express app
const app = express();

// Enable CORS for all routes
app.use(cors());

// Create HTTP server and attach Express app
const server = http.createServer(app);

// Create Socket.io instance and attach to HTTP server
const io = socketIo(server, { cors: { origin: '*' } });

// Store user data
const users = {};

// Handle Socket.io connections
io.on('connection', socket => {
    // Handle new user joined event
    socket.on('new-user-joined', name => {
        console.log('New user joined:', name);
        users[socket.id] = name;
        socket.broadcast.emit('user-joined', name);
    });

    // Handle send message event
    socket.on('send', message => {
        console.log('Message received:', message);
        socket.broadcast.emit('receive', { message: message, name: users[socket.id] });
    });
});

// Start the server
server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

