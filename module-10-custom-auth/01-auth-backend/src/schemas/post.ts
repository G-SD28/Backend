import * as z from 'zod';

const postInputSchema = z.strictObject({
	title: z
		.string({ message: 'Title must be a string' })
		.min(1, { message: 'Title is required' })
		.max(100, { message: 'Title cannot exceed 100 characters' })
		.trim(),
	content: z
		.string({ message: 'Body must be a string' })
		.min(1, {
			message: 'Body is required',
		})
		.max(5000, {
			message: 'Body cannot exceed 5000 characters',
		})
		.trim(),
	author: z
		.string({ error: 'Author must be a string' })
		.regex(/^[a-f\d]{24}$/i, {
			message: 'Author must be a valid ObjectId',
		}),
	image: z.string(),
});

export default postInputSchema;
