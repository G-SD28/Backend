import type { RequestHandler } from 'express';
import { Post } from '#models';

const authourize = (...acceptedRoles: string[]): RequestHandler => {
  return async (req, res, next) => {
    if (!req.user) {
      throw new Error('Not Authorized', { cause: { status: 401 } });
    }

    const { roles } = req.user;

    if (!roles.some((role) => acceptedRoles.includes(role))) {
      throw new Error('Forbidden', { cause: { status: 403 } });
    }

    const post = await Post.findById(req.params.id);

    if (!post) {
      throw new Error('Post not found', { cause: { status: 404 } });
    }

    const author = post.author;
    const { id } = req.user;

    if (roles.includes('user') && id === author.toString()) {
      next();
      return;
    }

    if (roles.includes('admin')) {
      next();
      return;
    }

    throw new Error('Forbidden', { cause: { status: 403 } });
  };
};

export default authourize;
