import jwt from 'jsonwebtoken';
import type { Types } from 'mongoose';
import { ACCESS_JWT_SECRET } from '#config';
import crypto from 'node:crypto';
import { RefreshToken } from '#models';

type UserData = {
	_id: Types.ObjectId;
	roles: string[];
};

export const createToken = (userData: UserData) => {
	const token = jwt.sign(
		{ id: userData._id, roles: userData.roles },
		ACCESS_JWT_SECRET,
		{
			expiresIn: '5s',
		},
	);

	return token;
};

export const getCookieOptions = () => ({
	httpOnly: true,
	secure: true,
	sameSite: 'none' as const,
});

export async function createRefreshToken(id: Types.ObjectId) {
	const refreshToken = crypto.randomBytes(25).toString('hex');

	await RefreshToken.create({ token: refreshToken, userId: id });

	return refreshToken;
}
