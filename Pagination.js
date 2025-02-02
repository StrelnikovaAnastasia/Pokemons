import { $ } from "./$.js";
import { Pokemons } from "./Pokemons.js";
import { Card } from "./Card.js";

export class Pagination {
    buttonsPerPage = 3;
    promise;

    async createPageButtons() {
        let infoPokemon = new Pokemons();
        let items = await infoPokemon.getAll();
        const totalPages = Math.ceil(items.length / infoPokemon.itemsPerPage);

        const pageButton = Array.from(document.querySelector('.btn').getElementsByClassName("button"));
        pageButton.forEach((item) => this.clickOnPageNumber(item));

        this.clickOnArrow(pageButton, totalPages);
    }

    clickOnPageNumber(pageButton) {
        pageButton.addEventListener('click', () => {
            if (this.promise) return;
            if (!pageButton.textContent) {
                return;
            }
            let error = new $(".error");
            error.hide();
            let card = new Card();
            card.preloader.show();

            const cards = new $('.cards');
            let pro = document.querySelector(".bx-loader-circle");

            if (pro) {
                pro.remove();
            }

            let currentPageButton = parseInt(pageButton.textContent) - 1;

            this.promise = card.createPokemonCards(currentPageButton)
                .catch(() => alert("Произошла ошибка, обновите страницу и попробуйте еще раз"))
                .finally(() => {
                    this.promise = null
                    card.preloader.hide();
                });
                
            cards.clear();
            window.scrollTo(0, 0);
            
        })
        
    }

    clickOnArrow(pageButton, totalPages) {
        document.querySelector(".bxs-chevron-right").addEventListener("click", () => {
            let currentPageButton = Number(document.querySelector(".btn").lastElementChild.textContent);
            let whenEnd = currentPageButton + this.buttonsPerPage;
            this.changeOptionButton(currentPageButton, whenEnd, totalPages, pageButton);
        })

        document.querySelector(".bxs-chevron-left").addEventListener("click", () => {
            let whenEnd = Number(document.querySelector(".btn").firstElementChild.textContent) - 1;
            if (whenEnd == 0) {
                whenEnd = totalPages;
            }
            let currentPageButton = whenEnd - this.buttonsPerPage;
            this.changeOptionButton(currentPageButton, whenEnd, totalPages, pageButton);
        })
    }

    changeOptionButton(currentPageButton, whenEnd, totalPages, pageButton) {
        for (let i = currentPageButton; i < whenEnd; i++) {
            if (i + 1 < totalPages) {
                pageButton[i - currentPageButton].textContent = i + 1;
            }
            else {
                pageButton[i - currentPageButton].textContent = "";
            }
        }
    }
}