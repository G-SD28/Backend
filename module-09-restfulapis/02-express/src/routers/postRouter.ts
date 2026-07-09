import { Router } from "express";
import {
  getAllPosts,
  createPost,
  getPostById,
  updatePost,
  deletePost,
} from "#controllers";
import { validateBody } from "#middlewares";
import { postInputSchema } from "#schemas";

const postRouter = Router();

postRouter
  .route("/")
  .get(getAllPosts)
  .post(validateBody(postInputSchema), createPost);
postRouter
  .route("/:id")
  .get(getPostById)
  .put(validateBody(postInputSchema), updatePost)
  .delete(deletePost);

export default postRouter;
