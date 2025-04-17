import 'dotenv/config';
import {app, server} from './app.js';
import {ConnectPeer} from '../server-peer/dist/index.js';


const port = process.env.PORT || 8002;

app.get('/', (req, res) => {
    res.send('Server is running');
});

const peer = new ConnectPeer(server);
peer.connect();

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});