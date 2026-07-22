import type { z } from 'zod';
import { FinalResponse, PromptBodySchema } from '#schemas';

export type IncomingPrompt = z.infer<typeof PromptBodySchema>;

export type ErrorResponseDTO = {
	success: false;
	error: string;
};
export type FinalResponseDTO =
	| z.infer<typeof FinalResponse>
	| ErrorResponseDTO
	| { completion: string };

export type Pokemon = {
	id: number;
	name: string;
	aboutSpecies: { name: string; url: string };
	types: string[];
	abilities: string[];
	frontSpriteURL: string | null;
};
