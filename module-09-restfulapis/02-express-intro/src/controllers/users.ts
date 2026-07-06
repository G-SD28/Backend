import type { RequestHandler } from "express";
import { User } from "#models";

export const getAllUsers: RequestHandler = async (req, res) => {
  try {
    const allUsers = await User.find();
    res.json(allUsers);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    } else {
      res.status(500).json({ message: "Etwas ist schief gelaufen!" });
    }
  }
};
