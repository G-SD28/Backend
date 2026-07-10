import type { RequestHandler } from "express";
import { User } from "#models";
import { isValidObjectId } from "mongoose";
import * as z from "zod";
import { userInputSchema } from "#schemas";
import type { Types } from "mongoose";
import type { IdParams } from "#types";

type UserInputDTO = z.infer<typeof userInputSchema>;
type UserDTO = UserInputDTO & {
  _id: InstanceType<typeof Types.ObjectId>;
  createdAt: Date;
};

export const getAllUsers: RequestHandler<unknown, UserDTO[]> = async (
  req,
  res,
) => {
  const allUsers = await User.find().lean();
  res.status(200).json(allUsers);
};

export const createUser: RequestHandler<
  unknown,
  UserDTO,
  UserInputDTO
> = async (req, res) => {
  const newUser = await User.create(req.body satisfies UserInputDTO);
  res.status(201).json(newUser);
};

export const getUserById: RequestHandler<IdParams, UserDTO> = async (
  req,
  res,
) => {
  if (!isValidObjectId(req.params.id)) {
    throw new Error("Invalid user ID format", { cause: 400 });
  }
  const user = await User.findById(req.params.id).lean();
  if (!user) {
    throw new Error("No user found with the provided ID", { cause: 404 });
  }
  res.status(200).json(user);
};

export const updateUser: RequestHandler<
  IdParams,
  UserDTO,
  UserInputDTO
> = async (req, res) => {
  if (!isValidObjectId(req.params.id)) {
    throw new Error("Invalid user ID format", { cause: 400 });
  }
  const user = await User.findByIdAndUpdate(req.params.id, req.body, {
    returnDocument: "after",
  }).lean();
  if (!user) {
    throw new Error("No user found with the provided ID", { cause: 404 });
  }
  res.status(200).json(user);
};

export const deleteUser: RequestHandler<IdParams> = async (req, res) => {
  if (!isValidObjectId(req.params.id)) {
    throw new Error("Invalid user ID format", { cause: 400 });
  }
  const user = await User.findByIdAndDelete(req.params.id);
  if (!user) {
    throw new Error("No user found with the provided ID", { cause: 404 });
  }
  res.status(204).json({ message: "User deleted successfully" });
};
