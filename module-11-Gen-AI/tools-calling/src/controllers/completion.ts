import type { RequestHandler } from 'express';
import type {
	IncomingPrompt,
	FinalResponseDTO,
	ErrorResponseDTO,
} from '#types';
import type {
	ChatCompletionMessageParam,
	ChatCompletionTool,
} from 'openai/resources';
import OpenAI from 'openai';
import { getPokemon, returnError } from '#utils';
import type { Pokemon } from '#types';
import { zodResponseFormat } from 'openai/helpers/zod.mjs';
import { FinalResponse } from '#schemas';

const tools: ChatCompletionTool[] = [
	{
		type: 'function',
		function: {
			strict: true,
			name: 'get_pokemon',
			description: 'Get details for a single Pokémon by name',
			parameters: {
				type: 'object',
				description: 'The name of the Pokémon to get details for',
				properties: {
					pokemonName: {
						type: 'string',
						description:
							'The name of the Pokémon to get details for',
						example: 'Pikachu',
					},
				},
				required: ['pokemonName'],
				additionalProperties: false,
			},
		},
	},
	{
		type: 'function',
		function: {
			strict: true,
			name: 'return_error',
			description:
				'Return an error when the user asks something that is NOT about a Pokémon',
			parameters: {
				type: 'object',
				description: 'The reason why the question is not about Pokémon',
				properties: {
					message: {
						type: 'string',
						description:
							'The reason why the question is not about Pokémon',
						example: 'This question is not about Pokémon',
					},
				},
				required: ['message'],
				additionalProperties: false,
			},
		},
	},
];

export const createCompletion: RequestHandler<
	unknown,
	FinalResponseDTO,
	IncomingPrompt
> = async (req, res) => {
	const { prompt } = req.body;

	const client = new OpenAI({
		apiKey:
			process.env.NODE_ENV === 'development'
				? process.env.LOCAL_LLM_KEY
				: process.env.ANTHROPIC_API_KEY,
		baseURL:
			process.env.NODE_ENV === 'development'
				? process.env.LMS_URL
				: process.env.ANTHROPIC_URL,
	});

	const model =
		process.env.NODE_ENV === 'development'
			? process.env.LMS_MODEL!
			: process.env.ANTHROPIC_MODEL!;

	const messages: ChatCompletionMessageParam[] = [
		{
			role: 'developer',
			content: `You determine if a question is about Pokémon. If the user asks about a Pokémon you will call the get_pokemon function to fetch data about it. If the question is not about Pokémon you will call the return_error function with a reason why the question is not about Pokémon`,
		},
		{
			role: 'user',
			content: prompt,
		},
	];

	const checkIntentCompletion = await client.chat.completions.create({
		model,
		messages,
		temperature: 0,
		tools,
		tool_choice: 'required',
	});

	const checkIntentCompletionMessage =
		checkIntentCompletion.choices[0]?.message;

	if (!checkIntentCompletionMessage) {
		res.status(500).json({
			success: false,
			error: 'Failed to generate a response from the model.',
		});
		return;
	}

	messages.push(checkIntentCompletionMessage);

	for (const toolCall of checkIntentCompletionMessage.tool_calls || []) {
		if (toolCall.type === 'function') {
			const name = toolCall.function.name;
			const args = JSON.parse(toolCall.function.arguments);

			console.log(
				`Tool call detected ${name} with args: ${JSON.stringify(args)}`,
			);

			let result: Pokemon | ErrorResponseDTO | string = '';

			if (name === 'get_pokemon') {
				result = await getPokemon({ pokemonName: args.pokemonName });
			}
			if (name === 'return_error') {
				result = await returnError({ message: args.message });
			}

			messages.push({
				role: 'tool',
				tool_call_id: toolCall.id,
				content: JSON.stringify(result),
			});
		}
	}

	const finalCompletion = await client.chat.completions.parse({
		model,
		messages,
		response_format: zodResponseFormat(FinalResponse, 'FinalResponse'),
	});

	const finalResponseMessage = finalCompletion.choices[0]?.message.parsed;

	if (!finalResponseMessage) {
		res.status(500).json({
			success: false,
			error: 'Failed to generate a final response',
		});
		return;
	}

	res.json(finalResponseMessage);
};
