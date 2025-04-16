import http from 'http';
import { Express } from 'express';
import { WebSocketServer, WebSocket } from 'ws';

class ConnectPeer {
  private wss: WebSocketServer;

  constructor(app: Express, server?: http.Server) {
    let httpServer: http.Server;

    if (server) {
      httpServer = server;
    } else {
      const existingServer = this.getServerFromExpressApp(app);
      if (existingServer) {
        httpServer = existingServer;
      } else {
        httpServer = http.createServer(app);
      }
    }

    this.wss = new WebSocketServer({ server: httpServer });

    this.wss.on('connection', (ws: WebSocket) => {
      console.log('A user connected');

      ws.on('message', (message: string) => {
        let parsed;
        try {
          parsed = JSON.parse(message);
        } catch {
          return console.error('Invalid JSON');
        }

        const { type, data } = parsed;

        switch (type) {
          case 'chat message':
            console.log('message:', data);
            this.broadcast(JSON.stringify({ type: 'chat message', data }));
            break;

          case 'typing':
            this.broadcastExceptSender(ws, JSON.stringify({ type: 'typing', data }));
            break;

          case 'stop typing':
            this.broadcastExceptSender(ws, JSON.stringify({ type: 'stop typing', data }));
            break;

          default:
            console.log('Unknown message type:', type);
        }
      });

      ws.on('close', () => {
        console.log('User disconnected');
      });
    });

    console.log('ConnectPeer initialized with WebSocket');
  }

  private broadcast(message: string) {
    this.wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  }

  private broadcastExceptSender(sender: WebSocket, message: string) {
    this.wss.clients.forEach((client) => {
      if (client !== sender && client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  }

  private getServerFromExpressApp(app: Express): http.Server | null {
    if ((app as any)._server) {
      return (app as any)._server;
    }
    return null;
  }

  getWSS(): WebSocketServer {
    return this.wss;
  }
}

export { ConnectPeer };
