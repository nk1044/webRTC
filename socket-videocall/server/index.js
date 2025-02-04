import { app, server } from './app.js';  // Import the express app and server

// Define a simple route to check the server
app.get('/', (req, res) => {
    res.send('Hello World');
});

// Start the server listening on port 8000
server.listen(8000, () => {
    console.log('Server is running on port 8000');
});
