import { $ } from "./$.js";

export class BigCard extends $ {

    constructor(selector) {
        super(selector);
        this.bigCard_type1 = document.querySelector("#type1BigCard");
        this.bigCard_type2 = document.querySelector("#type2BigCard");
        this.bigCard_header = new $("#headerBigCard");
        this.bigCard_img = new $("#imgBigCard");

        this.specificationsSpanHeight = new $("#specificationsSpanHeight");
        this.specificationsSpanExperience = new $("#specificationsSpanExperience");
        this.specificationsSpanWeight = new $("#specificationsSpanWeight");
        this.specificationsSpanAbilities = new $("#specificationsSpanAbilities");

        this.statsSpanHP = new $("#statsSpanHP");
        this.statsSpanAttack = new $("#statsSpanAttack");
        this.statsSpanDefence = new $("#statsSpanDefence");
        this.statsSpanSpecialAttack = new $("#statsSpanSpecialAttack");
        this.statsSpanSpecialDefence = new $("#statsSpanSpecialDefence");
        this.statsSpanSpeed = new $("#statsSpanSpeed");

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
        })

        this.bigCard_type1.classList.add(types[0], "type");
        this.bigCard_type2.classList.add(types[1], "type");
        this.bigCard_type1.textContent = types[0];
        this.bigCard_type2.textContent = types[1];

        types = [];

        this.specificationsSpanHeight.attr('textContent', element.height);
        this.specificationsSpanExperience.attr('textContent', element.base_experience);
        this.specificationsSpanWeight.attr('textContent', element.weight);
        element.abilities.forEach((el) => {
            if (el.is_hidden = "false") {
                this.specificationsSpanAbilities.attr('textContent', el.ability.name);
            }
        });

        let stats = [];
        element.stats.forEach((el, ind) => {
            stats[ind] = el.base_stat;
        })

        this.statsSpanHP.attr('textContent', stats[0]);
        this.statsSpanAttack.attr('textContent', stats[1]);
        this.statsSpanDefence.attr('textContent', stats[2]);
        this.statsSpanSpecialAttack.attr('textContent', stats[3]);
        this.statsSpanSpecialDefence.attr('textContent', stats[4]);
        this.statsSpanSpeed.attr('textContent', stats[5]);
    }
}