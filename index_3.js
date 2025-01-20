class Page {

    constructor(items = 25, buttons = 3) {
        this.itemsPerPage = items;
        this.buttonsPerPage = buttons;
    }

    async createPokemonCards(currentPage = 0) {

        let infoPokemon = new Pokemons();
        const pokemons = await infoPokemon.getByPage(currentPage, this.itemsPerPage);

        pokemons.forEach((element, index) => {

            this.createCard();

            let card = new Card(".card");
            card.attr(id, ++index);

            let firstLetter = element.name.charAt(0).toUpperCase();
            let lastWord = element.name.slice(1);

            card.img.attr(src, element.sprites.front_default);
            card.span.attr(textContent, firstLetter + lastWord);

            let types = [];
            element.types.forEach((el, ind) => {
                types[ind] = el.type.name;
            })
            card.type.classList.add(types[0]);
            card.weakness.classList.add(types[1]);
            card.type.textContent = types[0];
            card.weakness.textContent = types[1];
            types = [];

        })

    }

    createCard() {

            const card = document.createElement("div");
            const img = document.createElement("img");
            const span = document.createElement("span");
            const typesPokemon = document.createElement("div");
            const type = document.createElement("span");
            const weakness = document.createElement("span");

            img.classList.add("img");
            span.classList.add("span");
            card.classList.add("card");
            type.classList.add("type");
            weakness.classList.add("type");
            typesPokemon.classList.add("typesPokemon")

            type.id = "type";
            weakness.id = "weakness";
            card.id = ++index;

            document.querySelector(".cards").appendChild(card);
            card.appendChild(span);
            card.appendChild(img);
            card.appendChild(typesPokemon);
            typesPokemon.appendChild(type);
            typesPokemon.appendChild(weakness);

    }

    showBigCard() {

        this.card.addEventListener("click", async () => {

            let bigCard = new BigCard(".bigCard");

            bigCard.show();

            bigCard.type1BigCard.className = " ";
            bigCard.type2BigCard.className = " ";
            bigCard.headerBigCard.attr(textContent, firstLetter + lastWord);
            bigCard.imgBigCard.attr(src, element.sprites.front_default);

            let types = [];
            element.types.forEach((el, ind) => {
                types[ind] = el.type.name;
            })

            bigCard.type1BigCard.classList.add(types[0], "type");
            bigCard.type2BigCard.classList.add(types[1], "type");
            bigCard.type1BigCard.attr(textContent, types[0]);
            bigCard.type2BigCard.attr(textContent, types[1]);

            types = [];

            bigCard.specificationsSpanHeight.attr(textContent, element.height);
            bigCard.specificationsSpanExperience.attr(textContent, element.base_experience);
            bigCard.specificationsSpanWeight.attr(textContent, element.weight);
            element.abilities.forEach((el) => {
                if (el.is_hidden = "false") {
                    bigCard.specificationsSpanAbilities.attr(textContent, el.ability.name);
                }
            });

            let stats = [];
            element.stats.forEach((el, ind) => {
                stats[ind] = el.base_stat;
            })

            bigCard.statsSpanHP.attr(textContent, stats[0]);
            bigCard.statsSpanAttack.attr(textContent, stats[1]);
            bigCard.statsSpanDefence.attr(textContent, stats[2]);
            bigCard.statsSpanSpecialAttack.attr(textContent, stats[3]);
            bigCard.statsSpanSpecialDefence.attr(textContent, stats[4]);
            bigCard.statsSpanSpeed.attr(textContent, stats[5]);
        })
    }

    async createPageButtons() {

    }
}

class Pokemons {

    async getByPage(pageNumber, itemsPerPage) {

        const pokemons = [];
        const startIndex = pageNumber * itemsPerPage + 1;
        const endIndex = startIndex + itemsPerPage;

        for (let i = startIndex; i < endIndex; i++) {
            let pokemon = await fetch(`https://pokeapi.co/api/v2/pokemon/${i}/`).then(res => res.json());
            pokemons.push(pokemon);
        }
        return pokemons;

    }

    async getById(id) {

        let pokemon = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}/`).then(res => res.json());
        return pokemon;

    }

    async getAll() {

        const data = await fetch("https://pokeapi.co/api/v2/pokemon/?limit=1026").then(res => res.json()).catch(() => alert("что-то пошло не так, обновите страницу"));
        return data.results;
    }
}

class ${

    #element;

    constructor(selector) {
        this.#element = document.querySelector(selector)
    }

    hide() {
        this.#element.classList.add("hidden");
    }

    show() {
        this.#element.classList.remove("hidden");
    }

    clear() {
        this.#element.innerHTML = '';
        this.#element.textContent = '';
    }

    attr(key, value) {
        if (value) {
            this.#element[key] = value;
        }
        return this.#element[key];
    }

    data(key, value) {
        if (value) {
            this.#element.dataset[key] = value;
        }
        return this.#element.dataset[key];
    }

}

class Card extends $ {

    constructor(selector) {

        super(selector);

        this.img = new $(".img");
        this.span = new $(".span");
        this.type = new $("#type");
        this.weakness = new $("#weakness");
        
    }

}

class BigCard extends ${

    constructor(selector) {

        super(selector);
        
        this.bigCard_type1 = new $("#type1BigCard");
        this.bigCard_type2 = new $("#type2BigCard");
        this.bigCard_header = new $("#headerBigCard");
        this.bigCard_img = new $("#imgBigCard");

        this.specificationsSpanHeight = new $("#specificationsSpanHeight");
        this.specificationsSpanExperience = new $("#specificationsSpanExperience");
        this.specificationsSpanWeight = new $("#specificationsSpanWeight");
        this.pecificationsSpanAbilities = new $("#specificationsSpanAbilities");

        this.statsSpanHP = new $("#statsSpanHP");
        this.statsSpanAttack = new $("#statsSpanAttack");
        this.statsSpanDefence = new $("#statsSpanDefence");
        this.statsSpanSpecialAttack = new $("#statsSpanSpecialAttack");
        this.statsSpanSpecialDefence = new $("#statsSpanSpecialDefence");
        this.statsSpanSpeed = new $("#statsSpanSpeed");
    }

}