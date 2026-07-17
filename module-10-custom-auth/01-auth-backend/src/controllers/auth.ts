import type { RequestHandler } from 'express';
import bcrypt from 'bcrypt';
import { User, RefreshToken } from '#models';
import { createRefreshToken, createToken, getCookieOptions } from '#utils';
import { REFRESH_TOKEN_TTL } from '#config';

export const register: RequestHandler = async (req, res) => {
	const { firstName, lastName, email, password } = req.body;

	const userExists = await User.exists({ email });

	if (userExists) {
		throw new Error('User already exists', { cause: { status: 409 } });
	}

	const hashedPassword = await bcrypt.hash(password, 10);

	const newUser = await User.create({
		...req.body,
		password: hashedPassword,
	});

	const { password: _, ...data } = newUser.toObject();

	const token = createToken(data);
	const refreshToken = await createRefreshToken(newUser._id);
	const cookieOptions = getCookieOptions();

	res.cookie('token', token, cookieOptions);
	res.cookie('refreshToken', refreshToken, {
		httpOnly: true,
		secure: process.env.NODE_ENV === 'production',
		sameSite: 'strict',
		maxAge: REFRESH_TOKEN_TTL * 100,
	});

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
	const refreshToken = await createRefreshToken(user._id);
	const cookieOptions = getCookieOptions();

	res.cookie('token', token, cookieOptions);
	res.cookie('refreshToken', refreshToken, {
		httpOnly: true,
		secure: process.env.NODE_ENV === 'production',
		sameSite: 'strict',
		maxAge: REFRESH_TOKEN_TTL * 100,
	});

	res.json({ user: data });
};

export const logout: RequestHandler = async (req, res) => {
	const { refreshToken } = req.cookies;

	if (refreshToken) {
		await RefreshToken.findOneAndDelete({ token: refreshToken });
	}

	res.clearCookie('token');
	res.clearCookie('refreshToken');
	res.json({ message: 'Logged out' });
};

export const me: RequestHandler = async (req, res, next) => {
	return res.json({ user: req.user });
};

export const refresh: RequestHandler = async (req, res) => {
	const { refreshToken } = req.cookies;
	if (!refreshToken)
		throw new Error('Refresh token is required', {
			cause: { status: 401 },
		});

	const storedToken = await RefreshToken.findOne({ token: refreshToken });

	if (!storedToken)
		throw new Error('Refresh token not found', { cause: { status: 401 } });

	await RefreshToken.findByIdAndDelete(storedToken._id);

	const user = await User.findById(storedToken.userId);
	if (!user) throw new Error('User not found', { cause: { status: 404 } });

	const { password: _, ...data } = user.toObject();

	const token = createToken(data);
	const newRefreshToken = await createRefreshToken(user._id);

	const cookieOptions = getCookieOptions();
	res.cookie('token', token, cookieOptions);
	res.cookie('refreshToken', newRefreshToken, {
		httpOnly: true,
		secure: process.env.NODE_ENV === 'production',
		sameSite: 'strict',
		maxAge: REFRESH_TOKEN_TTL * 100,
	});

	res.status(200).json({ message: 'Refreshed' });
};
