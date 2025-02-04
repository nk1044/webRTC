import express from 'express';  // Make sure express is imported
import { Server } from "socket.io";
import http from 'http';
import cors from 'cors';

// Create an express application
export const app = express();  

// Create an HTTP server for the express app
export const server = http.createServer(app);

// Apply CORS middleware
app.use(cors({
    origin: "http://localhost:5173",  // Adjust origin as needed
    credentials: true
}));

// Create a socket.io server attached to the HTTP server
export const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",  // Allow your frontend
        credentials: true
    }
});

// Socket.io connection event
io.on('connection', (socket) => {
    console.log('A user connected', socket.id);

    socket.on('disconnect', (reason) => {
        console.log('User disconnected:', reason, socket.id);
    });

    socket.on('join-room', (data) => {
        const roomId = data?.roomId;
        const userId = data?.userId;

        if (!roomId || !userId) {
            console.error('Invalid data received for joining room:', data);
            return;
        }

        console.log(`User ${userId} joined room: ${roomId}`);
        socket.join(roomId);
        socket.to(roomId).emit('user-connected', userId);
    });

    socket.on('send-message', (data)=>{
        const { roomId, userId, message } = data;
        if (!roomId || !userId || !message) {
            console.error('Invalid message data:', data);
            return;
        }
        console.log(`Message from ${userId} in room ${roomId}: ${message}`);
        socket.to(roomId).emit('receive-message', { userId, message });
    });

    socket.on('send-stream', (data) => {
        const { roomId, userId, stream } = data;

        if (!roomId || !userId || !stream) {
            console.error('Invalid data received for sending stream:', data);
            return;
        }
        socket.to(roomId).emit('receive-stream', { userId, stream });
    });
});

