import { Router } from "express";
import {
  getPosts,
  createPost,
  getPostById,
  updatePost,
  deletePost,
} from "#controllers";

const userRouter = Router();

userRouter.route("/").get(getPosts).post(createPost);
userRouter.route("/:id").get(getPostById).put(updatePost).delete(deletePost);

export default userRouter;