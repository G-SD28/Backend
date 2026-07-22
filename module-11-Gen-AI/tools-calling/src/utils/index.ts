import type { ErrorResponseDTO, Pokemon } from '#types';
import Pokedex from 'pokedex-promise-v2';
export const getPokemon = async ({
	pokemonName,
}: {
	pokemonName: string;
}): Promise<Pokemon> => {
	console.log(`get_pokemon called with: ${pokemonName}`);

	const P = new Pokedex();
	const pokemonData = await P.getPokemonByName(pokemonName.toLowerCase());

	const trimmedData = {
		id: pokemonData.id,
		name: pokemonData.name,
		aboutSpecies: pokemonData.species,
		types: pokemonData.types.map((t) => t.type.name),
		abilities: pokemonData.abilities.map((a) => a.ability.name),
		stats: pokemonData.stats.map((s) => ({
			name: s.stat.name,
			value: s.base_stat,
		})),
		frontSpriteURL: pokemonData.sprites.front_default,
	};

	return trimmedData;
};

export const returnError = async ({
	message,
}: {
	message: string;
}): Promise<ErrorResponseDTO> => {
	console.error(`Error: ${message}`);
	return {
		success: false,
		error: message,
	};
};
