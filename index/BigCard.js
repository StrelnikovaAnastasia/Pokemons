import { $ } from './$.js';

export class BigCard extends $ {
    constructor(selector) {
        super(selector);
        this.bigCard_type1 = document.querySelector('#types__type-1');
        this.bigCard_type2 = document.querySelector('#types__type-2');
        this.bigCard_header = new $('#header-big-card');
        this.bigCard_img = new $('.section__img');

        this.specificationsSpanHeight = new $('#specifications-span-height');
        this.specificationsSpanExperience = new $(
            '#specifications-span-experience'
        );
        this.specificationsSpanWeight = new $('#specifications-span-weight');
        this.specificationsSpanAbilities = new $(
            '#specifications-span-abilities'
        );

        this.statsSpanHP = new $('#stats-span-hp');
        this.statsSpanAttack = new $('#stats-span-attack');
        this.statsSpanDefence = new $('#stats-span-defence');
        this.statsSpanSpecialAttack = new $('#stats-span-special-attack');
        this.statsSpanSpecialDefence = new $('#stats-span-special-defence');
        this.statsSpanSpeed = new $('#stats-span-speed');
    }

    addInfo(element) {
        let firstLetter = element.name.charAt(0).toUpperCase();
        let lastWord = element.name.slice(1);

        this.bigCard_type1.className = '';
        this.bigCard_type2.className = '';
        this.bigCard_header.attr('textContent', firstLetter + lastWord);
        this.bigCard_img.attr('src', element.sprites.front_default);

        let types = [];
        element.types.forEach((el, ind) => {
            types[ind] = el.type.name;
        });

        this.bigCard_type1.classList.add(types[0], 'type');
        this.bigCard_type2.classList.add(types[1], 'type');
        this.bigCard_type1.textContent = types[0];
        this.bigCard_type2.textContent = types[1];

        this.specificationsSpanHeight.attr('textContent', element.height);
        this.specificationsSpanExperience.attr(
            'textContent',
            element.base_experience
        );
        this.specificationsSpanWeight.attr('textContent', element.weight);
        element.abilities.forEach((el) => {
            if ((el.is_hidden = 'false')) {
                this.specificationsSpanAbilities.attr(
                    'textContent',
                    el.ability.name
                );
            }
        });

        let stats = [];
        element.stats.forEach((el, ind) => {
            stats[ind] = el.base_stat;
        });

        this.statsSpanHP.attr('textContent', stats[0]);
        this.statsSpanAttack.attr('textContent', stats[1]);
        this.statsSpanDefence.attr('textContent', stats[2]);
        this.statsSpanSpecialAttack.attr('textContent', stats[3]);
        this.statsSpanSpecialDefence.attr('textContent', stats[4]);
        this.statsSpanSpeed.attr('textContent', stats[5]);
    }
}
