import express, { Express, Request, Response } from "express";

const app: Express = express();
const port:Number = 3000;

app.use(express.json());


app.get("/", (req:Request, res:Response) => {
  res.send("Hello World!");
});


app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});