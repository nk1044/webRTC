import http from 'http';
import { Server } from 'socket.io';

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
    });
  }
}

export { ConnectPeer };
