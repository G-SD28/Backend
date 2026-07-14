import jwt from 'jsonwebtoken';
import type { Types } from 'mongoose';
import { ACCESS_JWT_SECRET } from '#config';

type UserData = {
  _id: Types.ObjectId;
  roles: string[];
};

export const createToken = (userData: UserData) => {
  const token = jwt.sign(
    { id: userData._id, roles: userData.roles },
    ACCESS_JWT_SECRET,
  );

  return token;
};

export const getCookieOptions = () => ({
  httpOnly: true,
  secure: true,
  sameSite: 'none' as const,
});
