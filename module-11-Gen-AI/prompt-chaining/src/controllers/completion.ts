import type { promptBodySchema } from '#schemas';
import type { RequestHandler } from 'express';
import { z } from 'zod';
import OpenAI from 'openai';
import { FinalResponse, Intent } from '#schemas';
import { zodResponseFormat } from 'openai/helpers/zod';
import Pokedex from 'pokedex-promise-v2';
import type { ChatCompletionMessageParam } from 'openai/resources';

type IncomingPrompt = z.infer<typeof promptBodySchema>;
type ResponseCompletion = { completion: string };
type FinaleResponseDTO = z.infer<typeof FinalResponse> | { completion: string };

export const createCompletion: RequestHandler<
	unknown,
	FinaleResponseDTO,
	IncomingPrompt
> = async (req, res) => {
	const { prompt } = req.body;
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

	const model =
		process.env.NODE_ENV === 'development'
			? process.env.LMS_MODEL!
			: process.env.ANTHROPIC_MODEL!;

	const checkIntentCompletion = await client.chat.completions.parse({
		model,
		messages: [
			{
				role: 'system',
				content:
					'You determine if a question is about Pokémon. You can only answer questions about a single Pokémon and not open-ended questions.',
			},
			{ role: 'user', content: prompt },
		],
		temperature: 0,
		response_format: zodResponseFormat(Intent, 'Intent'),
	});

	const intent = checkIntentCompletion.choices[0]?.message.parsed;

	if (!intent?.isPokemon) {
		res.status(400).json({
			completion:
				intent?.reason ||
				'I cannot answer this question, try asking about Pokemon',
		});
		return;
	}

	const P = new Pokedex();

	let pokemonData;
	try {
		pokemonData = await P.getPokemonByName(
			intent.pokemonName.toLowerCase(),
		);
	} catch (e) {
		res.status(404).json({
			completion: `Pokémon ${intent.pokemonName} not found`,
		});
		return;
	}

	// const trimmedData = {
	// 	name: pokemonData.name,
	// 	types: pokemonData.types.map((t) => t.type.name),
	// 	abilities: pokemonData.abilities.map((a) => a.ability.name),
	// 	stats: pokemonData.stats.map((s) => ({
	// 		name: s.stat.name,
	// 		value: s.base_stat,
	// 	})),
	// 	height: pokemonData.height,
	// 	weight: pokemonData.weigh,
	// };

	const finalMessages: ChatCompletionMessageParam[] = [
		{
			role: 'system',
			content: `You are a Pokemon expert. Use the following fetch Pokemon data to answer the user query accurately.\n\n Data:${JSON.stringify(pokemonData)} `,
		},
		{ role: 'user', content: prompt },
	];

	const finalCompletion = await client.chat.completions.parse({
		model,
		messages: finalMessages,
		temperature: 0,
		response_format: zodResponseFormat(FinalResponse, 'FinalResponse'),
	});

	const finalResponse = finalCompletion.choices[0]?.message.parsed;

	if (!finalResponse) {
		res.status(500).json({
			completion: 'Failed to generate a final response',
		});
		return;
	}

	res.json(finalResponse);
};
