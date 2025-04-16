import 'dotenv/config';
import {server, app} from './app.js';
import {Print} from '../server-peer/dist/index.js';

const port = process.env.PORT || 8002;

app.get('/', (req, res) => {
    res.send('Server is running');
});

server.listen(port, () => {
    Print();
  console.log(`Server is running on port ${process.env.PORT}`);
});

