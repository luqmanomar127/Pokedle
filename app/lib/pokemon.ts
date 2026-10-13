export type Pokemon = {
  name: string;
  generation: string;
  type1: string;
  type2: string;
  evolution: number;
  sprite: string;
}

export function getEvolutionStage(chain: any, speciesName: string, depth = 1): number | null {
  if (chain.species.name === speciesName) {
    return depth;
  }

  for (const next of chain.evolves_to) {
    const found = getEvolutionStage(next, speciesName, depth + 1);
    if (found) {
      return (found);
    }
  }
  return null;
}

export async function getPokemonData(name: string | number) {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`);
    const data = await response.json();

    if(!response.ok){
        throw new Error("Could not fetch resource");
    }

    const speciesResponse = await fetch(data.species.url);
    const speciesData = await speciesResponse.json();

    let evolution = 1;
    if (speciesData.evolution_chain) {
      const evolutionResponse = await fetch(speciesData.evolution_chain.url);
      const evolutionData = await evolutionResponse.json();
      evolution = getEvolutionStage(evolutionData.chain, speciesData.name) ?? 1;
    }

    return {
        name: data.name,
        generation: speciesData.generation.name.replace("generation-", "Gen ").toUpperCase(),
        type1: data.types[0]?.type.name,
        type2: data.types[1]?.type.name || "",
        evolution,
        sprite: data.sprites.front_shiny || data.sprites.front_default
    };
}