import { $ } from "./$.js";
import { Pokemons } from "./Pokemons.js";

export class Search {
    writeQuest() {
        let inputSearch = document.querySelector(".input");
        inputSearch.addEventListener("input", async () => {
            const value = inputSearch.value.trim();
            let list = new $(".list");
            list.clear();
            this.clean();
            if (value.length < 3) {
                return;
            }
            let infoPokemon = new Pokemons();
            let items = await infoPokemon.getAll();
            this.setList(items, value);

        })
    }

    clean() {
        let error = new $("#error");
        let findAnswer = new $(".findAnswer");
        error.clear();
        findAnswer.hide();
    }

    setList(results, value) {
        let flag = false;
        for (const pokemon of results) {
            const name = pokemon.name.trim();
            let list = new $(".list");
            list.show();
            if (name.includes(value)) {
                this.clean();

                let search_header = new $("#headerSearch");
                let search_span = new $("#spanSearch");
                let search_img = new $("#imgSearch");

                search_header.attr('textContent', "загрузка данных...")
                search_span.clear();
                search_img.attr("src", " ");

                const resultItem = document.createElement("li");
                resultItem.classList.add("resultItem");
                resultItem.textContent = name;
                list.appendChild(resultItem);
                resultItem.addEventListener("click", async () => {
                    let findAnswer = new $(".findAnswer");
                    findAnswer.show();

                    let infoPokemon = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}/`)
                        .then(res => res.json())
                        .catch(() => alert("Ошибка загрузки карточки, обновите страницу и попробуйте еще раз"));
                    search_header.attr("textContent", infoPokemon.name);
                    search_span.attr("textContent", "base experience: " + infoPokemon.base_experience
                        + '\r\n' + "weight: " + infoPokemon.weight);
                    search_img.attr("src", infoPokemon.sprites.front_default);
                })
                flag = true;
            }
        }
        if (!flag) {
            const errorItem = document.createElement("span");
            errorItem.classList.add("error");
            errorItem.textContent = "Ничего не найдено, убедитесь, что вы пишите на английском";
            document.querySelector("#error").appendChild(errorItem);
        }

    }
}