import { Router } from "express";
import {
  getAllPosts,
  createPost,
  getPostById,
  updatePost,
  deletePost,
} from "#controllers";

const userRouter = Router();

userRouter.route("/").get(getAllPosts).post(createPost);
userRouter.route("/:id").get(getPostById).put(updatePost).delete(deletePost);

export default userRouter;
