import { app, server } from './app.js';  // Import the express app and server

// Define a simple route to check the server
app.get('/', (req, res) => {
    res.send('Hello World');
});

async function callWakupServer() {
    try {
        await fetch('https://wakeup-server:01.onrender.com/health-check');
    } catch (error) {
        console.log('Error in wakup server', error);
        
    }
};

// Define a simple route to check the server
app.get('/health-check', (req, res) => {
    try {
        callWakupServer();
    } catch (error) {
        console.log('Error in health-check of wakup server', error);
    }
    res.send('Hello World');
});

// Start the server listening on port 8000
server.listen(8000, () => {
    console.log('Server is running on port 8000');
});
