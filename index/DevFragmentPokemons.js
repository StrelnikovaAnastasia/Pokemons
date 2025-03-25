import { DevFragment } from './DevFragment.js';

export class DevFragmentPokemons extends DevFragment {
    constructor() {
        super();
    }

    render(data) {
        this.createPokemonCards();
    }

    async createPokemonCards(currentPage = 0) {
        const pokemons = await this.load(currentPage);
        pokemons.forEach((element) => {
            element.then(async (element) => {
                const pokemon = document.createElement('dev-fragment-pokemon');
                await pokemon.setActive(true);
                pokemon.addInfo(element);
                pokemon.clickOnCard(element);
                this.appendChild(pokemon);
            });
        });
    }

    async load(pageNumber = 0) {
        const pokemons = [];
        const infoPokemons = await fetch(
            `https://pokeapi.co/api/v2/pokemon/?limit=25&offset=${
                pageNumber * 25
            }/`
        ).then((res) => res.json());
        infoPokemons.results.forEach((element) => {
            pokemons.push(fetch(element.url).then((res) => res.json()));
        });
        return pokemons;
    }
}
customElements.define('dev-fragment-pokemons', DevFragmentPokemons);
