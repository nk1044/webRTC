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

io.on("connection", (socket) => {
  console.log("a user connected", socket.id);
 
  socket.on('join-room', (data)=>{
    console.log(data);
    EmailToSocket.set(data?.email, socket.id);
    socket.join(data?.roomId);
    socket.broadcast.to(data?.roomId).emit('user-joined', data);
    socket.emit('joined-room', {roomId: data?.roomId});
  })
});

io.listen(3000);