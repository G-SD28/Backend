import express from "express";
import "#db";
import { userRouter, postRouter } from "#routers";
import { logger, errorHandler } from "#middlewares";

const app = express();
const port = 3000;

// Application-level middlewares
app.use(express.json());
app.use(logger);
// app.use(express.static("public"));

app.use("/users", userRouter);
app.use("/posts", postRouter);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.all("/*splat", async (req, res) => {
  throw new Error("Page not found", { cause: 404 });
});

app.use(errorHandler);

app.listen(port, () => {
  console.log("Server läuft auf http://localhost:3000");
});
