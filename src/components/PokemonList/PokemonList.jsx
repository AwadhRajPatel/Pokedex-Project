import { useEffect, useState } from "react";
import axios from "axios";
import "./PokemonList.css";
import Pokemon from "../Pokemon/Pokemon";
function PokemonList() {
  // const [pokemonList, setPokemonList] = useState([]);
  // const [isLoading, setIsLoading] = useState(true);

  // const[pokedexUrl,setPokedexUrl] = useState(" https://pokeapi.co/api/v2/pokemon");

  // const [nextUrl,setNextUrl] = useState("");
  // const [prevUrl,setPrevUrl] = useState("");

  const [pokemonListState, setPokemonListState] = useState({
    pokemonList: [],
    isLoading: true,
    pokedexUrl: "https://pokeapi.co/api/v2/pokemon",
    nextUrl: "",
    prevUrl: "",
  });

  async function downloadPokemons() {
    // setIsLoading(true);
    setPokemonListState({ ...pokemonListState, isLoading: true });
    const response = await axios.get(pokemonListState.pokedexUrl); //This download list of 20 pokemons

    const pokemonResults = response.data.results; //we get the array of pokemons from result

    console.log(response.data);

    setPokemonListState((state) =>({
      ...state,
      nextUrl: response.data.next,
      prevUrl: response.data.previous,
    }));
    // setNextUrl(response.data.next);
    // setPrevUrl(response.data.previous);

    // iterating over the array of pokemons, and using their url, to create an array of promise
    // that will download those 20 pokemne
    const pokemonResultPromise = pokemonResults.map((pokemon) =>
      axios.get(pokemon.url)
    );
    const pokemonData = await axios.all(pokemonResultPromise); //array of pokemon details data
    console.log(pokemonData);

    // now iterate on the data of each pokemon and extract id ,name image type
    const pokeListResult = pokemonData.map((pokeData) => {
      const pokemon = pokeData.data;
      return {
        id: pokemon.id,
        name: pokemon.name,
        image: pokemon.sprites.other
          ? pokemon.sprites.other.dream_world.front_default
          : pokemon.sprites.front_default,
        types: pokemon.types,
      };
    });
    console.log(pokeListResult);
    setPokemonListState((state)=>({
      ...state,
      pokemonList: pokeListResult,
      isLoading: false,
    }));
    // setPokemonList(pokeListResult);
    // setIsLoading(false);
  }

  useEffect(() => {
    downloadPokemons();
  }, [pokemonListState.pokedexUrl]);

  return (
    <>
      <div className="pokemon-list-wrapper">
        <div className="pokemon-wrapper">
          {pokemonListState.isLoading
            ? " Loading...."
            : pokemonListState.pokemonList.map((p) => (
                <Pokemon name={p.name} image={p.image} key={p.id} id={p.id} />
              ))}
        </div>
        <div className="control">
          <button
            disabled={pokemonListState.prevUrl == null}
            onClick={() =>
              setPokemonListState({
                ...pokemonListState,
                pokedexUrl: pokemonListState.prevUrl,
              })
            }
          >
            Prev
          </button>
          <button
            disabled={pokemonListState.nextUrl == null}
            onClick={() =>
              setPokemonListState({
                ...pokemonListState,
                pokedexUrl: pokemonListState.nextUrl,
              })
            }
          >
            Next
          </button>
        </div>
      </div>
    </>
  );
}

export default PokemonList;
