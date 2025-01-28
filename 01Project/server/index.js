import { Server } from "socket.io";
import express from "express";
import 'body-parser';

const app = express();
const io = new Server({cors: {origin: "http://localhost:5173"}});

app.get("/", (req, res) => {
    res.send("server is up and running 😎");
    }
);

app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));    



app.listen(9000, () => {
    console.log("listening on :9000");
    }
);


const EmailToSocket = new Map();
const SocketToEmail = new Map();

io.on("connection", (socket) => {
  console.log("a user connected", socket.id);
 
  socket.on('join-room', (data)=>{
    console.log(data);
    EmailToSocket.set(data?.email, socket.id);
    SocketToEmail.set(socket.id, data?.email);
    socket.join(data?.roomId);
    socket.broadcast.to(data?.roomId).emit('user-joined', data);
    socket.emit('joined-room', {roomId: data?.roomId});
  })

  socket.on('call-user', (data)=>{
    console.log("offer got for user", data?.email);
    const socketId = EmailToSocket.get(data?.email);
    const fromEmail = SocketToEmail.get(socket.id);
    socket.to(socketId).emit('user-called', {email: fromEmail, offer: data?.offer});
  })


  socket.on('accept-call', (data)=>{
    console.log("answer got for user", data?.email);
    const socketId = EmailToSocket.get(data?.email);
    const fromEmail = SocketToEmail.get(socket.id);
    socket.to(socketId).emit('call-accepted', {answer: data?.answer, email: fromEmail});
  })

});

io.listen(3000);