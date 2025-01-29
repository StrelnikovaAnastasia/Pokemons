import { Card } from "./Card.js";
import { Pagination } from "./Pagination.js";
import { Search } from "./Search.js";

export class Page {
    constructor() {
        this.cards = new Card();
        this.pagination = new Pagination();
        this.search = new Search();
        this.generation();
    }

    async generation() {
        await this.cards.createPokemonCards();
        this.cards.preloader.hide();
        this.pagination.createPageButtons();
        this.search.showSearch();
        this.search.writeQuest();
    }
}