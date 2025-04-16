import express, { Express, Request, Response } from "express";
import http from "http";
import cors from "cors";

export const app: Express = express();
export const server = http.createServer(app);


app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/health", (req:Request, res:Response) => {
    res.send("Server is healthy!");
  });
  



