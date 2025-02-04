import { Server } from "socket.io";

const io = new Server({
    cors: {
        origin: "*", // Allow all origins
    }
});

io.on('connection', (socket) => {
    console.log('A user connected');

    socket.on('disconnect', (reason) => {
        console.log('User disconnected:', reason);
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
        
        // Emit event to other users in the room
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

});



export default io;