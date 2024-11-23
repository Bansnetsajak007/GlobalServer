import express from 'express';
import http from 'http';
import { Server } from 'socket.io';

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*",
    },
});

const PORT = 5000;

const users = new Map();

io.on('connection', (socket) => {
    socket.on('set username', (username) => {
        users.set(socket.id, username);
        console.log(`Username set for ${socket.id}: ${username}`);
    });

    socket.on('broadcast', () => {
        const joinedUser = users.get(socket.id) || 'Anonymous';
        console.log(joinedUser);
        io.emit('broadcast', { joinedUserData: joinedUser });
    });

    socket.on('chat message', (message) => {
        const userName = users.get(socket.id) || 'Anonymous';
        const jsonData = { userName, message };
        io.emit('chat message', jsonData);
    });

    socket.on('disconnect', () => {
        const disconnectedUser = users.get(socket.id) || 'Anonymous';
        console.log('user disconnected:', socket.id, disconnectedUser);
        io.emit('user disconnected', disconnectedUser);
        users.delete(socket.id);
    });
});

server.listen(PORT, () => {
    console.log('server listening on port', PORT);
});
