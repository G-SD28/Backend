import type { promptBodySchema } from '#schemas';
import OpenAI from 'openai';
import type { RequestHandler } from 'express';
import { z } from 'zod';
import type { ChatCompletionCreateParamsNonStreaming } from 'openai/resources';
import { createOpenAICCompletion } from '#utils';

type IncomingPrompt = z.infer<typeof promptBodySchema>;
type ResponseCompletion = { completion: string };

export const createOllamaCompletion: RequestHandler<
	unknown,
	ResponseCompletion,
	IncomingPrompt
> = async (req, res) => {
	const { prompt } = req.body;

	const client = new OpenAI({
		apiKey:
			process.env.NODE_ENV === 'development'
				? 'ollama'
				: process.env.ANTHROPIC_API_KEY,
		baseURL:
			process.env.NODE_ENV === 'development'
				? process.env.OLLAMA_URL
				: process.env.ANTHROPIC_URL,
	});

	const completion = await client.chat.completions.create({
		model:
			process.env.NODE_ENV === 'development'
				? process.env.OLLAMA_MODEL!
				: process.env.ANTHROPIC_MODEL!,
		messages: [
			{ role: 'developer', content: 'you are a helpful assistant' },
			{
				role: 'user',
				content: prompt,
			},
		],
	});

	res.status(200).json({
		completion:
			completion.choices[0]?.message.content || 'No completion generated',
	});
};

export const createLMSCompletion: RequestHandler<
	unknown,
	ResponseCompletion,
	IncomingPrompt
> = async (req, res) => {
	const { prompt, stream } = req.body;

	const client = new OpenAI({
		apiKey:
			process.env.NODE_ENV === 'development'
				? process.env.LMS_API_KEY
				: process.env.ANTHROPIC_API_KEY,
		baseURL:
			process.env.NODE_ENV === 'development'
				? process.env.LMS_URL
				: process.env.ANTHROPIC_URL,
	});

	const baseRequest: ChatCompletionCreateParamsNonStreaming = {
		model:
			process.env.NODE_ENV === 'development'
				? process.env.LMS_MODEL!
				: process.env.ANTHROPIC_MODEL!,
		messages: [
			{
				role: 'developer',
				content: 'You are a helpful assitant',
			},
			{ role: 'user', content: prompt },
		],
	};
	await createOpenAICCompletion(client, res, baseRequest, stream);
};
