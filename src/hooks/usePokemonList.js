import axios from "axios";
import { useEffect, useState } from "react";

function usePokemonList(url){

    const [pokemonListState, setPokemonListState] = useState({
        pokemonList: [],
        isLoading: true,
        pokedexUrl: url,
        nextUrl: "",
        prevUrl: "",
      });

      async function downloadPokemons() {
       setPokemonListState({ ...pokemonListState, isLoading: true });  //before
      //  setPokemonListState((state)=>({...state,isLoading:true}))
        const response = await axios.get(pokemonListState.pokedexUrl); //This download list of 20 pokemons
    
        const pokemonResults = response.data.results; //we get the array of pokemons from result
    
        console.log(response.data);
    
        setPokemonListState((state) =>({
          ...state,
          nextUrl: response.data.next,
          prevUrl: response.data.previous,
        }));
        
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
       
      }

      useEffect(() =>{
        downloadPokemons();
      },[pokemonListState.pokedexUrl]);

      return {pokemonListState,setPokemonListState}
}

export default usePokemonList;