class $ {

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

class Page extends HTMLElement {

    constructor(items = 25, buttons = 3) {
        super()
        this.itemsPerPage = items;
        this.buttonsPerPage = buttons;
        this.infoPokemon = new Pokemons();
        this.generation();

        this.preloader = {
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
    }

    async generation() {
        let promise = await this.createPokemonCards();
        this.preloader.hide();
        this.createPageButtons();
        this.changePage();
        this.inputSearch();
    }

    async createPokemonCards(currentPage = 0) {
        const pokemons = await this.infoPokemon.getByPage(currentPage, this.itemsPerPage);

        pokemons.forEach((element, index) => {
            this.createCard(element, index);
        })

    }

    async createPageButtons() {
        let items = await this.infoPokemon.getAll();
        const totalPages = Math.ceil(items.length / this.itemsPerPage);

        const pageButton = Array.from(document.querySelector('.btn').getElementsByClassName("button"));
        pageButton.forEach((item) => this.openList(item));

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

    openList(pageButton) {
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

            this.createPokemonCards(currentPageButton)
                .then(() => forLoad.hide())
                .finally(() => {
                    this.preloader.hide();
                });

            cards.clear();
            window.scrollTo(0, 0);
            forLoad.show();
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

    createCard(element, index) {
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

        let firstLetter = element.name.charAt(0).toUpperCase();
        let lastWord = element.name.slice(1);

        img.src = element.sprites.front_default;
        span.textContent = firstLetter + lastWord;

        let types = [];
        element.types.forEach((el, ind) => {
            types[ind] = el.type.name;
        })
        type.classList.add(types[0]);
        weakness.classList.add(types[1]);
        type.textContent = types[0];
        weakness.textContent = types[1];
        types = [];

        type.id = "type";
        weakness.id = "weakness";
        card.id = ++index;

        document.querySelector(".cards").appendChild(card);
        card.appendChild(span);
        card.appendChild(img);
        card.appendChild(typesPokemon);
        typesPokemon.appendChild(type);
        typesPokemon.appendChild(weakness);

        this.showBigCard(card, element);

    }

    showBigCard(card, element) {
        card.addEventListener("click", async () => {
            let bigCard = new $(".bigCard");

            bigCard.show();

            this.addInfoBigCard(element);

            document.querySelector(".closeButton").addEventListener("click", () => {
                bigCard.hide();
            })
        })
    }

    addInfoBigCard(element) {

        let bigCard_type1 = document.querySelector("#type1BigCard");
        let bigCard_type2 = document.querySelector("#type2BigCard");
        let bigCard_header = new $("#headerBigCard");
        let bigCard_img = new $("#imgBigCard");

        let specificationsSpanHeight = new $("#specificationsSpanHeight");
        let specificationsSpanExperience = new $("#specificationsSpanExperience");
        let specificationsSpanWeight = new $("#specificationsSpanWeight");
        let specificationsSpanAbilities = new $("#specificationsSpanAbilities");

        let statsSpanHP = new $("#statsSpanHP");
        let statsSpanAttack = new $("#statsSpanAttack");
        let statsSpanDefence = new $("#statsSpanDefence");
        let statsSpanSpecialAttack = new $("#statsSpanSpecialAttack");
        let statsSpanSpecialDefence = new $("#statsSpanSpecialDefence");
        let statsSpanSpeed = new $("#statsSpanSpeed");

        let firstLetter = element.name.charAt(0).toUpperCase();
        let lastWord = element.name.slice(1);

        bigCard_type1.className = '';
        bigCard_type2.className = '';
        bigCard_header.attr('textContent', firstLetter + lastWord);
        bigCard_img.attr('src', element.sprites.front_default);

        let types = [];
        element.types.forEach((el, ind) => {
            types[ind] = el.type.name;
        })

        bigCard_type1.classList.add(types[0], "type");
        bigCard_type2.classList.add(types[1], "type");
        bigCard_type1.textContent = types[0];
        bigCard_type2.textContent = types[1];

        types = [];

        specificationsSpanHeight.attr('textContent', element.height);
        specificationsSpanExperience.attr('textContent', element.base_experience);
        specificationsSpanWeight.attr('textContent', element.weight);
        element.abilities.forEach((el) => {
            if (el.is_hidden = "false") {
                specificationsSpanAbilities.attr('textContent', el.ability.name);
            }
        });

        let stats = [];
        element.stats.forEach((el, ind) => {
            stats[ind] = el.base_stat;
        })

        statsSpanHP.attr('textContent', stats[0]);
        statsSpanAttack.attr('textContent', stats[1]);
        statsSpanDefence.attr('textContent', stats[2]);
        statsSpanSpecialAttack.attr('textContent', stats[3]);
        statsSpanSpecialDefence.attr('textContent', stats[4]);
        statsSpanSpeed.attr('textContent', stats[5]);
    }

    changePage() {
        let buttonList = document.querySelector(".bx-list-ul");
        let buttonSearch = document.querySelector(".bx-search");
        let form = new $("#form");
        let search = new $(".form");

        this.changeVisiblePage(buttonList, form, search);
        this.changeVisiblePage(buttonSearch, search, form);
    }

    changeVisiblePage(button, remove, add) {
        button.addEventListener("click", () => {
            remove.show();
            add.hide();
        })
    }

    clean() {
        let error = new $("#error");
        let findAnswer = new $(".findAnswer");
        error.clear();
        findAnswer.hide();
    }

    inputSearch() {
        let inputSearch = document.querySelector(".input");
        inputSearch.addEventListener("input", async () => {
            const value = inputSearch.value.trim();
            let list = new $(".list");
            list.clear();
            this.clean();
            if (value.length < 3) {
                return;
            }
            let items = await this.infoPokemon.getAll();
            this.setList(items, value);

        })
    }

    setList(results, value) {
        let flag = false;
        for (const pokemon of results) {
            const name = pokemon.name.trim();
            document.querySelector(".list").classList.remove("invisible");
            if (name.includes(value)) {
                this.clean();

                let search_header = new $("#headerSearch");
                let search_span = new $("#spanSearch");
                let search_img = new $("#imgSearch");

                search_header.attr('textContent', "загрузка данных...")
                search_span.clear();
                search_img.attr("src", " ");

                const resultItem = document.createElement("li");
                resultItem.classList.add("resultItem");
                resultItem.textContent = name;
                document.querySelector(".list").appendChild(resultItem);

                resultItem.addEventListener("click", async () => {
                    let findAnswer = new $(".findAnswer");
                    findAnswer.show();

                    let infoPokemon = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}/`).then(res => res.json());
                    search_header.attr("textContent", infoPokemon.name);
                    search_span.attr("textContent", "base experience: " + infoPokemon.base_experience
                        + '\r\n' + "weight: " + infoPokemon.weight);
                    search_img.attr("src", infoPokemon.sprites.front_default);
                })
                flag = true;
            }
        }
        if (!flag) {
            const errorItem = document.createElement("span");
            errorItem.classList.add("error");
            errorItem.textContent = "Ничего не найдено, убедитесь, что вы пишите на английском";
            document.querySelector("#error").appendChild(errorItem);
        }

    }

}

document.addEventListener("submit", (e) => { e.preventDefault() });

customElements.define('main-page', Page);
myElement = document.createElement("main-page");