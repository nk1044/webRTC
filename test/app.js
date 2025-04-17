import http from 'http';
import express from 'express';
import cors from 'cors';


export const app = express();
export const server = http.createServer(app);


app.use(cors());
app.use(express.json());


