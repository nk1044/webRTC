import http from 'http';
import { Server } from 'socket.io';
import {OfferPayload, AnswerPayload, IceCandidatePayload} from './Interfaces'

class ConnectPeer {
  private io!: Server;
  private server: http.Server;

  constructor(server: http.Server) {
    this.server = server;
  }

  public async connect() {
    this.io = new Server(this.server, {
      cors: {
        origin: '*',
        methods: ['GET', 'POST'],
      },
    });
    this.io.on('connection', (socket) => {
      console.log('a user connected, inside library');
      socket.on('disconnect', () => {
        console.log('user disconnected, inside library');
      });

      // video call starts
      socket.on("offer", ({ roomId, offer }:OfferPayload) => {
        socket.to(roomId).emit("offer", { offer });
      });

      socket.on("answer", ({ roomId, answer }:AnswerPayload) => {
        socket.to(roomId).emit("answer", { answer });
      }); 

      socket.on("ice-candidate", ({ roomId, candidate }:IceCandidatePayload) => {
        socket.to(roomId).emit("ice-candidate", { candidate });
      });
      // video call ends

    });
  }
}

export { ConnectPeer };
