import { Card } from "./Card.js";
import { Pagination } from "./Pagination.js";
import { ButtonChangePage } from "./ButtonChangePage.js";
import { Search } from "./Search.js";

export class Page {
    constructor() {
        this.cards = new Card();
        this.pagination = new Pagination();
        this.changePageButton = new ButtonChangePage();
        this.search = new Search();
        this.generation();
    }

    async generation() {
        await this.cards.createPokemonCards();
        this.pagination.preloader.hide();
        this.pagination.createPageButtons();
        this.changePageButton.clickOnButton();
        this.search.writeQuest()
    }
}