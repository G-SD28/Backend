import type { RequestHandler } from "express";
import { Post } from "#models";
import { isValidObjectId } from "mongoose";

type Post = {
  title: string;
  body: string;
  author: string;
};

export const getAllPosts: RequestHandler = async (req, res) => {
  const allPosts = await Post.find().populate(
    "author",
    "firstName lastName -_id",
  );
  res.status(200).json(allPosts);
};

export const createPost: RequestHandler<unknown, unknown, Post> = async (
  req,
  res,
) => {
  const { title, body, author } = req.body;
  if (!title || !body || !author) {
    throw new Error("Missing required fields: title, body and author", {
      cause: 400,
    });
  }
  if (!isValidObjectId(author)) {
    throw new Error("Invalid author ID format", { cause: 400 });
  }
  const newPost = await Post.create(req.body);
  res.status(201).json(newPost);
};

export const getPostById: RequestHandler<{ id: string }> = async (req, res) => {
  const { id } = req.params;
  if (!isValidObjectId(id)) {
    throw new Error("Invalid post ID format", { cause: 400 });
  }
  const post = await Post.findById(id);
  if (!post) {
    throw new Error("No post found with the provided ID", { cause: 404 });
  }
  res.status(200).json(post);
};

export const updatePost: RequestHandler<{ id: string }, unknown, Post> = async (
  req,
  res,
) => {
  const { title, body, author } = req.body;
  const { id } = req.params;
  if (!title || !body || !author) {
    throw new Error("Missing required fields: title, body and author", {
      cause: 400,
    });
  }
  if (!isValidObjectId(id)) {
    throw new Error("Invalid post ID format", { cause: 400 });
  }
  if (!isValidObjectId(author)) {
    throw new Error("Invalid author ID format", { cause: 400 });
  }
  const post = await Post.findByIdAndUpdate(
    id,
    { title, body, author },
    { returnDocument: "after" },
  );
  if (!post) {
    throw new Error("No post found with the provided ID", { cause: 404 });
  }
  res.status(200).json(post);
};

export const deletePost: RequestHandler<{ id: string }> = async (req, res) => {
  const { id } = req.params;
  if (!isValidObjectId(id)) {
    throw new Error("Invalid post ID format", { cause: 400 });
  }
  const post = await Post.findByIdAndDelete(id);
  if (!post) {
    throw new Error("No post found with the provided ID", { cause: 404 });
  }
  res.status(204).json({ message: "Post deleted successfully" });
};
