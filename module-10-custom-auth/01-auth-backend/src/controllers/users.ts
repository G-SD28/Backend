import type { RequestHandler } from 'express';
import { User } from '#models';
import { isValidObjectId } from 'mongoose';

type User = {
  firstName: string;
  lastName: string;
  email: string;
};

export const getAllUsers: RequestHandler = async (req, res) => {
  const allUsers = await User.find();
  res.status(200).json(allUsers);
};

export const createUser: RequestHandler<unknown, unknown, User> = async (
  req,
  res,
) => {
  const authHeader = req.header('authorization');
  console.log(authHeader);

  if (authHeader !== 'Bearer hello') {
    throw new Error('Not Authorized');
  }

  const { firstName, lastName, email } = req.body;
  if (!firstName || !lastName || !email) {
    throw new Error('Missing required fields: firstName, lastName and email', {
      cause: 400,
    });
  }
  const newUser = await User.create(req.body);
  res.status(201).json(newUser);
};

export const getUserById: RequestHandler<{ id: string }> = async (req, res) => {
  const { id } = req.params;
  if (!isValidObjectId(id)) {
    throw new Error('Invalid user ID format', { cause: 400 });
  }
  const user = await User.findById(id);
  if (!user) {
    throw new Error('No user found with the provided ID', { cause: 404 });
  }
  res.status(200).json(user);
};

export const updateUser: RequestHandler<{ id: string }, unknown, User> = async (
  req,
  res,
) => {
  const { firstName, lastName, email } = req.body;
  const { id } = req.params;
  if (!firstName || !lastName) {
    throw new Error('Missing required fields: firstName and lastName', {
      cause: 400,
    });
  }
  if (!isValidObjectId(id)) {
    throw new Error('Invalid user ID format', { cause: 400 });
  }
  const user = await User.findByIdAndUpdate(
    id,
    {
      firstName,
      lastName,
      email,
    },
    { returnDocument: 'after' },
  );
  if (!user) {
    throw new Error('No user found with the provided ID', { cause: 404 });
  }
  res.status(200).json(user);
};

export const deleteUser: RequestHandler<{ id: string }> = async (req, res) => {
  const { id } = req.params;
  if (!isValidObjectId(id)) {
    throw new Error('Invalid user ID format', { cause: 400 });
  }
  const user = await User.findByIdAndDelete(id);
  if (!user) {
    throw new Error('No user found with the provided ID', { cause: 404 });
  }
  res.status(204).json({ message: 'User deleted successfully' });
};
