import type { RequestHandler } from "express";
import { Post } from "#models";
import { isValidObjectId } from "mongoose";
import * as z from "zod";
import { postInputSchema } from "#schemas";
import type { Types } from "mongoose";
import type { IdParams } from "#types";

type PostInputDTO = z.infer<typeof postInputSchema>;
type PostDTO = Omit<PostInputDTO, "author"> & {
  author: InstanceType<typeof Types.ObjectId>;
  _id: InstanceType<typeof Types.ObjectId>;
  createdAt: Date;
  updatedAt: Date;
};

export const getAllPosts: RequestHandler<unknown, PostDTO[]> = async (
  req,
  res,
) => {
  const allPosts = await Post.find()
    .populate("author", "firstName lastName -_id")
    .lean()
    .sort({ createdAt: -1 });
  res.status(200).json(allPosts);
};

export const createPost: RequestHandler<
  unknown,
  PostDTO,
  PostInputDTO
> = async (req, res) => {
  const newPost = await Post.create(req.body satisfies PostInputDTO);
  res.status(201).json(newPost);
};

export const getPostById: RequestHandler<IdParams, PostDTO> = async (
  req,
  res,
) => {
  if (!isValidObjectId(req.params.id)) {
    throw new Error("Invalid ID", { cause: 400 });
  }
  const post = await Post.findById(req.params.id).lean();
  if (!post) {
    throw new Error("Post not found", { cause: 404 });
  }
  res.status(200).json(post);
};

export const updatePost: RequestHandler<
  IdParams,
  PostDTO,
  PostInputDTO
> = async (req, res) => {
  if (!isValidObjectId(req.params.id)) {
    throw new Error("Invalid ID", { cause: 400 });
  }
  const post = await Post.findByIdAndUpdate(req.params.id, req.body, {
    returnDocument: "after",
  }).lean();
  if (!post) {
    throw new Error("Post not found", { cause: 404 });
  }
  res.status(200).json(post);
};

export const deletePost: RequestHandler<IdParams> = async (req, res) => {
  if (!isValidObjectId(req.params.id)) {
    throw new Error("Invalid ID", { cause: 400 });
  }
  const post = await Post.findByIdAndDelete(req.params.id);
  if (!post) {
    throw new Error("Post not found", { cause: 404 });
  }
  res.status(204).json({ message: "Post deleted successfully" });
};
