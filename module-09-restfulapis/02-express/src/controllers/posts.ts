import type { RequestHandler } from "express";
import { Post } from "#models";
import { isValidObjectId } from "mongoose";

type Post = {
  title: string;
  body: string;
  author: string;
};

export const getAllPosts: RequestHandler = async (req, res) => {
  try {
    const allPosts = await Post.find().populate(
      "author",
      "firstName lastName -_id",
    );
    res.json(allPosts);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    } else {
      res.status(500).json({ message: "Etwas ist schief gelaufen!" });
    }
  }
};

export const createPost: RequestHandler<unknown, unknown, Post> = async (
  req,
  res,
) => {
  try {
    const { title, body, author } = req.body;

    if (!title || !body || !author) {
      return res.status(400).json({ message: "Fehlende Informationen!" });
    }

    if (!isValidObjectId(author)) {
      return res.status(400).json({ error: "Falsche Author-ID!" });
    }

    const newPost = await Post.create(req.body);

    res.status(201).json(newPost);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    } else {
      res
        .status(500)
        .json({ message: "Ressource konnte nicht erstellt werden!" });
    }
  }
};

export const getPostById: RequestHandler<{ id: string }> = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id))
      return res.status(400).json({ error: "Falsche ID!" });

    const post = await Post.findById(id);

    if (!post)
      return res
        .status(404)
        .json({ error: "Post konnte nicht gefunden werden!" });

    res.json(post);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    } else {
      res.status(500).json({ message: "Etwas ist schief gelaufen!" });
    }
  }
};

export const updatePost: RequestHandler<{ id: string }, unknown, Post> = async (
  req,
  res,
) => {
  try {
    const { title, body, author } = req.body;
    const { id } = req.params;

    if (!title || !body || !author) {
      return res.status(400).json({ message: "Fehlende Informationen!" });
    }

    if (!isValidObjectId(id))
      return res.status(400).json({ error: "Falsche ID!" });

    if (!isValidObjectId(author))
      return res.status(400).json({ error: "Falsche Author-ID!" });

    const post = await Post.findByIdAndUpdate(
      id,
      {
        title,
        body,
        author,
      },
      { returnDocument: "after" },
    );

    if (!post)
      return res
        .status(404)
        .json({ error: "Post konnte nicht gefunden werden!" });

    res.json(post);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    } else {
      res
        .status(500)
        .json({ message: "Ressource konnte nicht aktualisiert werden!" });
    }
  }
};

export const deletePost: RequestHandler<{ id: string }> = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id))
      return res.status(400).json({ error: "Falsche ID!" });

    const post = await Post.findByIdAndDelete(id);

    if (!post)
      return res
        .status(404)
        .json({ error: "Post konnte nicht gefunden werden!" });

    res.json({ message: "Post wurde gelöscht!" });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    } else {
      res.status(500).json({ message: "Etwas ist schief gelaufen!" });
    }
  }
};
