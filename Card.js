import { Pokemons } from './Pokemons.js';
import { BigCard } from './BigCard.js';
import { $ } from './$.js';

export class Card extends $ {
    constructor(selector) {
        super(selector);
    }

    preloader = {
        get: () => document.getElementById('preloader'),
        hide: () => {
            const elem = this.preloader.get();
            if (elem) elem.style.display = 'none';
        },
        show: () => {
            const elem = this.preloader.get();
            if (elem) elem.style.display = 'flex';
        },
    };

    create() {
        this.card = document.createElement('div');
        this.img = document.createElement('img');
        this.span = document.createElement('span');
        this.typesPokemon = document.createElement('div');
        this.type = document.createElement('span');
        this.weakness = document.createElement('span');

        this.img.classList.add('card__img');
        this.span.classList.add('card__span');
        this.card.classList.add('card');
        this.type.classList.add('type');
        this.weakness.classList.add('type');
        this.typesPokemon.classList.add('types');

        this.card.appendChild(this.span);
        this.card.appendChild(this.img);
        this.card.appendChild(this.typesPokemon);
        this.typesPokemon.appendChild(this.type);
        this.typesPokemon.appendChild(this.weakness);
        document.querySelector('.cards').appendChild(this.card);
    }

    async createPokemonCards(currentPage = 0) {
        let infoPokemon = new Pokemons();
        const pokemons = await infoPokemon.getByPage(currentPage);
        pokemons.forEach((element) => {
            element.then((pokemon) => {
                let card = new Card();
                card.create();
                card.addInfo(pokemon);
                card.clickOnCard(pokemon);
            });
        });
    }

    createFindPokemonsCard(pokemon) {
        let card = new Card();
        card.create();
        card.addInfo(pokemon);
        card.clickOnCard(pokemon);
    }

    addInfo(element) {
        let firstLetter = element.name.charAt(0).toUpperCase();
        let lastWord = element.name.slice(1);

        this.img.src = element.sprites.front_default;
        this.span.textContent = firstLetter + lastWord;

        let types = [];
        element.types.forEach((el, ind) => {
            types[ind] = el.type.name;
        });
        this.type.classList.add(types[0]);
        this.weakness.classList.add(types[1]);
        this.type.textContent = types[0];
        this.weakness.textContent = types[1];
    }

    clickOnCard(element) {
        this.card.addEventListener('click', async () => {
            let bigCard = new BigCard('.big-card');

            bigCard.show();

            bigCard.addInfo(element);

            document
                .querySelector('.close-button')
                .addEventListener('click', () => {
                    bigCard.hide();
                });
        });
    }
}
