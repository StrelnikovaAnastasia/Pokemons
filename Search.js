import { $ } from "./$.js";
import { Pokemons } from "./Pokemons.js";
import { BigCard } from "./BigCard.js";
import { Card } from "./Card.js";

export class Search {
    showSearch() {
        document.querySelector(".searchButton").addEventListener("click", () => {
            if (!document.querySelector(".inputSearch").value) {
                document.querySelector(".inputSearch").classList.toggle("hidden");
            }
        })
    }
    writeQuest() {
        let inputSearch = document.querySelector(".inputSearch");
        inputSearch.addEventListener("input", async () => {
            const value = inputSearch.value.trim();
            if (value.length < 3) {
                return;
            }
            let card = new Card();
            const cards = new $('.cards');
            card.preloader.show();
            cards.clear();

            let infoPokemon = new Pokemons();
            let items = await infoPokemon.getAll();

            this.setList(items, value)
                .catch(() => alert("Произошла ошибка, обновите страницу и попробуйте еще раз"))
                .finally(() => {
                    card.preloader.hide();
                });

        })
    }

    async setList(results, value) {
        let flag = false;
        let error = new $(".error");
        let pokemonsFind = [];
        error.hide();
        for (const pokemon of results) {
            const name = pokemon.name.trim();
            if (name.includes(value)) {
                pokemonsFind.push(pokemon);
                flag = true;
            }
        }
        let infoPokemon = new Pokemons();
        let card = new Card();
        let resultInfo = await infoPokemon.getBySearch(pokemonsFind);
        card.createFindPokemonsCard(resultInfo);
        if (!flag) {
            error.show();
        }
    }
}