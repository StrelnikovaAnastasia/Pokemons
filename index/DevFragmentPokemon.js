import { BigCard } from './BigCard.js';
import { DevFragment } from './DevFragment.js';

export class DevFragmentPokemon extends DevFragment {
    constructor() {
        super();
    }

    render(data) {
        this.create();
    }

    create() {
        this.img = document.createElement('img');

        this.span = document.createElement('span');
        this.typesPokemon = document.createElement('div');
        this.type = document.createElement('span');
        this.weakness = document.createElement('span');

        this.classList.add('card');
        this.img.classList.add('card__img');
        this.span.classList.add('card__span');
        this.type.classList.add('type');
        this.weakness.classList.add('type');
        this.typesPokemon.classList.add('types');

        this.appendChild(this.span);
        this.appendChild(this.img);
        this.appendChild(this.typesPokemon);
        this.typesPokemon.appendChild(this.type);
        this.typesPokemon.appendChild(this.weakness);
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
        this.addEventListener('click', async () => {
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
customElements.define('dev-fragment-pokemon', DevFragmentPokemon);
