import { Router } from "express";
import { getAllUsers } from "#controllers";

const userRouter = Router();

userRouter.route("/").get(getAllUsers);
// userRouter.route("/:id").get().put().delete();

export default userRouter;
