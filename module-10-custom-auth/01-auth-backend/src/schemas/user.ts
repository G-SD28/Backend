import * as z from 'zod';

const userInputSchema = z.strictObject({
	firstName: z
		.string({ message: 'First name must be a string' })
		.min(1, { message: 'First name is required' })
		.trim(),
	lastName: z
		.string({ message: 'Last name must be a string' })
		.min(1, { message: 'Last name is required' })
		.trim(),
	email: z
		.string({ message: 'Email must be a string' })
		.min(1, { message: 'Email is required' })
		.trim(),
	password: z
		.string({ message: 'Password must be a string' })
		.min(8, { message: 'Password must be at least 8 characters long' })
		.max(100, { message: 'Password cannot exceed 100 characters' }),
	roles: z.array(z.string()),
});

export default userInputSchema;
