import { Router } from 'express';
import {
  getAllPosts,
  createPost,
  getPostById,
  updatePost,
  deletePost,
} from '#controllers';
import { validateBody, authenticate, authorize } from '#middlewares';
import { postInputSchema } from '#schemas';

const postRouter = Router();

postRouter
  .route('/')
  .get(getAllPosts)
  .post(validateBody(postInputSchema), authenticate, createPost);
postRouter
  .route('/:id')
  .get(getPostById)
  .put(
    validateBody(postInputSchema),
    authenticate,
    authorize('user'),
    updatePost,
  )
  .delete(authenticate, authorize('user', 'admin'), deletePost);

export default postRouter;
