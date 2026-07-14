import type { RequestHandler } from "express";

const logger: RequestHandler = (req, res, next) => {
  const localTime = new Date().toLocaleString("de-DE", {
    timeZone: "Europe/Berlin",
  });
  console.log("Time: ", localTime, "Method: ", req.method);
  next();
};

export default logger;
