import express, { type Express, type Request, type Response } from "express";
import "#db";
import { userRouter } from "#routers";

const app: Express = express();
const port = 3000;

app.use(express.json());

app.use("/users", userRouter);

app.get("/", (req: Request, res: Response) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log("Server läuft auf http://localhost:3000");
});
