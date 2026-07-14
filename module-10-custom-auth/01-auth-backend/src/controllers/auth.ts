import type { RequestHandler } from 'express';
import bcrypt from 'bcrypt';
import { User } from '#models';
import { createToken, getCookieOptions } from '#utils';

export const register: RequestHandler = async (req, res) => {
  const { firstName, lastName, email, password } = req.body;

  const userExists = await User.exists({ email });

  if (userExists) {
    throw new Error('User already exists', { cause: { status: 409 } });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = await User.create({ ...req.body, password: hashedPassword });

  const { password: _, ...data } = newUser.toObject();

  const token = createToken(data);
  const cookieOptions = getCookieOptions();

  res.cookie('token', token, cookieOptions);

  res.json({ user: data });
};

export const login: RequestHandler = async (req, res) => {
  const { password, email } = req.body;

  const user = await User.findOne({ email }).select('+password');

  console.log(user);

  if (!user) {
    throw new Error('Invalid Credentials', { cause: { status: 401 } });
  }

  const match = await bcrypt.compare(password, user.password);

  if (!match) {
    throw new Error('Invalid Credentials', { cause: { status: 401 } });
  }

  const { password: _, ...data } = user.toObject();

  const token = createToken(data);
  const cookieOptions = getCookieOptions();

  res.cookie('token', token, cookieOptions);

  res.json({ user: data });
};

export const logout: RequestHandler = (req, res) => {
  res.clearCookie('token');
  res.json({ message: 'Logged out' });
};
