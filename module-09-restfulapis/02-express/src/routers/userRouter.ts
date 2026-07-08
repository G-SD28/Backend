import { Router } from "express";
import {
  getAllUsers,
  createUser,
  getUserById,
  updateUser,
  deleteUser,
} from "#controllers";
import type { RequestHandler } from "express";

// Route-level middleware
const logUserRequest: RequestHandler = (req, res, next) => {
  const localTime = new Date().toLocaleString("de-DE", {
    timeZone: "Europe/Berlin",
  });
  console.log(`Someone is accessing the users route at ${localTime}.`);
  next();
};

const userRouter = Router();

userRouter.route("/").get(logUserRequest, getAllUsers).post(createUser);
userRouter.route("/:id").get(getUserById).put(updateUser).delete(deleteUser);

export default userRouter;
