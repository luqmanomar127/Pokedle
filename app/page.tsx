"use client";

import React, {useEffect, useRef, useState} from "react";
import "./globals.css";
import Navbar from "./navbar";
import {getPokemonData, type Pokemon} from "./lib/pokemon"

export default function Home() {
  const secretPokemon = useRef<Pokemon | null>(null);
  const [pokemonName, setPokemonName] = useState("");
  const [guesses, setGuesses] = useState<Pokemon[]>([]);
  const [sprite, setSprite] = useState("");
  const [allNames, setAllNames] = useState<string[]>([]);
  
  async function startGame(random = false) {
    try {
      if (random) {
        const randomPokemon = Math.floor(Math.random() * 1025) + 1;
        secretPokemon.current = await getPokemonData(randomPokemon);
        console.log(secretPokemon.current.name);
      } else {
        const response = await fetch("./api/daily");
        const data = await response.json();
        secretPokemon.current = data.pokemon;
        console.log(secretPokemon.current?.name);
      }
    } catch (error) {
        console.error(error);
    }
}

function resetGame() {
  setGuesses([]);
  setSprite("");
  setPokemonName("");
  startGame(true);
}

useEffect(() => {startGame();}, []);

useEffect(() => { async function loadNames() {
  try {
    const response = await fetch("https://pokeapi.co/api/v2/pokemon?limit=1025");
    const data = await response.json();
    setAllNames(data.results.map((p: {name: string}) => p.name));
  } catch (error) {
    console.log(error);
  }
}
  loadNames();
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

        setGuesses((prev) => [pokemonData, ...prev]);

        if (pokemonData.name === secretPokemon.current!.name) {
            console.log("YOU WON!")
        }
    } catch (error){
        console.error(error);
    }
}

const input = pokemonName.toLowerCase();
const suggestions = input ? allNames.filter((n) => n.startsWith(input) && n !== input).slice(0, 8) : [];

  return (
    <div>
      <Navbar onReset={resetGame}/>

    <div className="div1">
        <h2>Welcome to Pokedle!</h2>
    </div>
    <div className="div2">
        <div className="input_row">
          <div className="input_wrap">
            <input type="text" className="input" id="pokemonName" placeholder="Enter Pokemon name" value={pokemonName} onChange={(e) => setPokemonName(e.target.value)} onKeyDown={(e) => {if (e.key === "Enter") fetchData();}}/>
            {suggestions.length > 0 && (<ul className="suggestions"> {suggestions.map((name) => (<li key={name} onClick={() => setPokemonName(name)}> {name}</li>))}</ul>)}
          </div>
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
              <span className={guess.evolution === secretPokemon.current?.evolution ? "correct" : "wrong"}>
                {guess.evolution}
              </span>
            </div>
          ))}
        </div>

        <img src={sprite} alt="Pokemon Sprite" id="pokemonSprite" style={{display: sprite ? "block" : "none"}}/>
      </div>
    </div>
  );
}
