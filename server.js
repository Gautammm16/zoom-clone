const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const { v4: uuidV4 } = require('uuid');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.set('view engine', 'ejs');
app.use(express.static('public'));

// Redirect root URL to a new room with a unique ID
app.get('/', (req, res) => {
    res.redirect(`/${uuidV4()}`);
});

// Render room view with the given room ID
app.get('/:room', (req, res) => {
    res.render('room', { roomId: req.params.room });
});

// Handle socket connection
io.on('connection', socket => {
    socket.on('join-room', (roomId, userId) => {
        console.log(`User ${userId} joined room ${roomId}`);
        socket.join(roomId);
        socket.to(roomId).emit('user-connected', userId);
        
        // Handle user disconnecting
        socket.on('disconnect', () => {
            console.log(`User ${userId} disconnected from room ${roomId}`);
            socket.to(roomId).emit('user-disconnected', userId);
        });
    });
});

// Start server on port 3000
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

// Error handling for the server
server.on('error', (err) => {
    console.error('Server error:', err);
});