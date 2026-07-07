import type { RequestHandler, Request, Response } from "express";
import { User } from "#models";
import { isValidObjectId } from "mongoose";

type User = {
  firstName: string;
  lastName: string;
  email: string;
};

export const getAllUsers: RequestHandler = async (
  req: Request,
  res: Response,
) => {
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

export const createUser: RequestHandler<{}, {}, User> = async (
  req: Request,
  res: Response,
) => {
  try {
    const { firstName, lastName, email } = req.body;

    if (!firstName || !lastName || !email) {
      return res.status(400).json({ message: "Fehlende Informationen!" });
    }

    const newUser = await User.create(req.body);

    res.status(201).json(newUser);
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

export const getUserById: RequestHandler<{ id: string }> = async (
  req: Request,
  res: Response,
) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id))
      return res.status(400).json({ error: "Falsche ID!" });

    const user = await User.findById(id);

    if (!user)
      return res
        .status(404)
        .json({ error: "Nutzer konnte nicht gefunden werden!" });

    res.json(user);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    } else {
      res.status(500).json({ message: "Etwas ist schief gelaufen!" });
    }
  }
};

export const updateUser: RequestHandler<{ id: string }, {}, User> = async (
  req: Request,
  res: Response,
) => {
  try {
    const { firstName, lastName, email } = req.body;
    const { id } = req.params;

    if (!firstName || !lastName) {
      return res.status(400).json({ message: "Fehlende Informationen!" });
    }

    if (!isValidObjectId(id))
      return res.status(400).json({ error: "Falsche ID!" });

    const user = await User.findByIdAndUpdate(
      id,
      {
        firstName,
        lastName,
        email,
      },
      { returnDocument: "after" },
    );

    if (!user)
      return res
        .status(404)
        .json({ error: "Nutzer konnte nicht gefunden werden!" });

    res.json(user);
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

export const deleteUser: RequestHandler<{ id: string }> = async (
  req: Request,
  res: Response,
) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id))
      return res.status(400).json({ error: "Falsche ID!" });

    const user = await User.findByIdAndDelete(id);

    if (!user)
      return res
        .status(404)
        .json({ error: "Nutzer konnte nicht gefunden werden!" });

    res.json({ message: "User wurde gelöscht!" });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    } else {
      res.status(500).json({ message: "Etwas ist schief gelaufen!" });
    }
  }
};
