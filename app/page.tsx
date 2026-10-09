"use client";

import React, {useEffect, useRef, useState} from "react";
import "./globals.css";

type Pokemon = {
  name: string;
  generation: string;
  type1: string;
  type2: string;
  sprite: string;
}

async function getPokemonData(name: string) {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`);

    if(!response.ok){
        throw new Error("Could not fetch resource");
    }

    const data = await response.json();

    const speciesResponse = await fetch(data.species.url);
    const speciesData = await speciesResponse.json();

    return {
        name: data.name,
        generation: speciesData.generation.name.replace("generation-", "Gen ").toUpperCase(),
        type1: data.types[0]?.type.name,
        type2: data.types[1]?.type.name || "",
        sprite: data.sprites.front_shiny || data.sprites.front_default
    };
}

export default function Home() {
  const secretPokemon = useRef<Pokemon | null>(null);
  const [pokemonName, setPokemonName] = useState("");
  const [guesses, setGuesses] = useState<Pokemon[]>([]);
  const [sprite, setSprite] = useState("");
  
  async function startGame() {
    try {
        const randomPokemon = Math.floor(Math.random() * 1025) + 1;
        secretPokemon.current = await getPokemonData(randomPokemon);
        console.log(secretPokemon.current.name);
    } catch (error) {
        console.error(error);
    }
}

useEffect(() => {
  startGame();
}, []);
  
  async function fetchData(){
    try{
        if (!secretPokemon.current) await startGame();

        const guessPokemon = pokemonName.toLowerCase();
        const pokemonData = await getPokemonData(guessPokemon);

        setSprite(pokemonData.sprite);

        const results = {
            generation: pokemonData.generation === secretPokemon.current!.generation,
            type1: pokemonData.type1 === secretPokemon.current!.type1,
            type2: pokemonData.type2 === secretPokemon.current!.type2,
        }

        console.log(results);

        setGuesses((prev) => [...prev, pokemonData]);

        if (pokemonData.name === secretPokemon.current!.name) {
            console.log("YOU WON!")
        }
    } catch (error){
        console.error(error);
    }
}

  return (
    <div>
      <nav className = "navbar">
        <ul>
            <li className="pokeLogo">
                <a href="index.html">
                    <img src="Pokemon_Logo-removebg-preview.png" alt="Please Micheal"/>
                </a>
            </li>
            <li className="dropdown1">
                <a href="#" className="dropdown1_trigger">Generation <span className="dropdown1_caret">▾</span></a>
                <ul className="dropdown1_panel">
                    <li><a href="#"><span className="dropdown1_icon">&#9670;</span> Gen 1</a></li>
                    <li><a href="#"><span className="dropdown1_icon">&#9670;</span> Gen 2</a></li>
                    <li><a href="#"><span className="dropdown1_icon">&#9670;</span> Gen 3</a></li>
                    <li><a href="#"><span className="dropdown1_icon">&#9670;</span> Gen 4</a></li>
                    <li><a href="#"><span className="dropdown1_icon">&#9670;</span> Gen 5</a></li>
                    <li><a href="#"><span className="dropdown1_icon">&#9670;</span> Gen 6</a></li>
                </ul>
            </li>
            <li><a href="#">Reset</a></li>
        </ul>
    </nav>

    <div className="div1">
        <h2>Welcome to Pokedle!</h2>
    </div>
    <div className="div2">
        <div className="input_row">
            <input type="text" className="input" id="pokemonName" placeholder="Enter Pokemon name" value={pokemonName} onChange={(e) => setPokemonName(e.target.value)}/>

            <div className="box-button">
                <button className="button" onClick={fetchData}><span>Fetch Pokemon!</span></button>
            </div>
        </div>

        <div id="guesses">
          {guesses.map((guess, i) =>(
            <div className="guessRow" key={i}>
              <img className="guessSprite" src={guess.sprite} alt={guess.name}/>
              <span className={guess.generation === secretPokemon.current?.generation ? "correct" : "wrong"}>
                {guess.generation}
              </span>
              <span className={guess.type1 === secretPokemon.current?.type1 ? "correct" : "wrong"}>
                {guess.type1}
              </span>
              <span className={guess.type2 === secretPokemon.current?.type2 ? "correct" : "wrong"}>
                {guess.type2 || "None"}
              </span>
            </div>
          ))}
        </div>

        <img src={sprite} alt="Pokemon Sprite" id="pokemonSprite" style={{display: sprite ? "block" : "none"}}/>
      </div>
    </div>
  );
}
