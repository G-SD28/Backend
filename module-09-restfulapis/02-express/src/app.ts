import express from "express";
import "#db";
import { userRouter, postRouter } from "#routers";

const app = express();
const port = 3000;

app.use(express.json());

app.use("/users", userRouter);
app.use("/posts", postRouter);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log("Server läuft auf http://localhost:3000");
});
