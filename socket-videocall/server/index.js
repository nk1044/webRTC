import express from 'express';
import io from './app.js';

const app = express();

app.get('/', (req, res)=>{
    res.send('Hello World');
})

app.listen(8000, ()=>{
    console.log('Server is running on port 3000');
});

io.listen(3000, ()=>{
    console.log('Server is running on port 3000');
});