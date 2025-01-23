import { $ } from "./$.js";
import { Pokemons } from "./Pokemons.js";
import { Card } from "./Card.js";

export class Pagination {
    buttonsPerPage = 3;
    preloader = {
        get: () => document.getElementById('preloader'),
        hide: () => {
            const elem = this.preloader.get();
            if (elem) elem.style.display = 'none';
        },
        show: () => {
            const elem = this.preloader.get();
            if (elem) elem.style.display = 'flex';
        }
    }

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
            if (!pageButton.textContent) {
                return;
            }
            this.preloader.show();

            const forLoad = new $('.forLoad');
            const cards = new $('.cards');
            let pro = document.querySelector(".bx-loader-circle");

            if (pro) {
                pro.remove();
            }

            let currentPageButton = parseInt(pageButton.textContent) - 1;

            let card = new Card();
            card.createPokemonCards(currentPageButton)
                .then(() => forLoad.hide())
                .catch(() => alert("Произошла ошибка, обновите страницу и попробуйте еще раз"))
                .finally(() => {
                    this.preloader.hide();
                });

            cards.clear();
            window.scrollTo(0, 0);
            forLoad.show();
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