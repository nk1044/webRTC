import { app } from "./app.js";
import { Request, Response } from "express";

const port:Number = 8001;


app.get("/", (req:Request, res:Response) => {
    res.send("server is running!");
  });
  

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
  });