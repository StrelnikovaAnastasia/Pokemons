class Pokemons extends HTMLElement {
    constructor() {
        super();
        const $ = document;
        this.divForm = $.createElement("div");
        this.divForm.classList.add("div_form");

        this.form = $.createElement("form");
        this.form.classList.add("form");

        this.head = $.createElement("div");
        this.head.classList.add("head");

        this.header = $.createElement("header");
        this.header.classList.add("header");

        this.buttonSearchLabel = $.createElement("label");
        this.buttonSearch = $.createElement("button");
        this.buttonSearch.classList.add("bx-search", "bx", "bx-md", "button", "buttonSwitch");

        this.h2 = $.createElement("h2");
        this.h2.textContent = "Покемоны";

        this.cards = $.createElement("div");
        this.cards.classList.add("cards");

        this.br = $.createElement("br");

        this.search = $.createElement("form");
        this.search.classList.add("form", "invisible");

        this.list = $.createElement("ul");
        this.list.classList.add("list", "invisible");

        this.headSearch = $.createElement("div");
        this.headSearch.classList.add("head");

        this.titleSearch = $.createElement("header");
        this.titleSearch.classList.add("header");
        this.titleSearch.textContent = "Поиск";

        this.brSearch = $.createElement("br");

        this.buttonListLabel = $.createElement("label");
        this.buttonList = $.createElement("button");
        this.buttonList.classList.add("bx-list-ul", "bx", "bx-lg", "button", "buttonSwitch");

        this.inputSearchLabel = $.createElement("label");
        this.inputSearch = $.createElement("input");
        this.inputSearch.classList.add("input");
        this.inputSearch.placeholder = "поиск..."

        this.error = $.createElement("div");

        this.findAnswer = $.createElement("form");
        this.findAnswer.classList.add("findAnswer", "hidden");

        this.headFindAnswer = $.createElement("div");
        this.headFindAnswer.classList.add("headFindAnswer");

        this.headFindAnswer__header = $.createElement("header");
        this.headFindAnswer__header.classList.add("header");

        this.brFind = $.createElement("br");

        this.headFindAnswer__span = $.createElement("span");
        this.headFindAnswer__span.classList.add("span");

        this.imgFindAnswer = $.createElement("img");
        this.imgFindAnswer.classList.add("img");

        this.divForm.appendChild(this.form);
        this.divForm.appendChild(this.search);
        this.divForm.appendChild(this.list);
        this.divForm.appendChild(this.findAnswer);

        this.form.appendChild(this.head);
        this.head.appendChild(this.header);
        this.head.appendChild(this.buttonSearchLabel);
        this.buttonSearchLabel.appendChild(this.buttonSearch);
        this.form.appendChild(this.cards);
        this.form.appendChild(this.br);
        this.header.appendChild(this.h2);
        this.search.appendChild(this.headSearch);
        this.search.appendChild(this.brSearch);
        this.headSearch.appendChild(this.titleSearch);
        this.headSearch.appendChild(this.buttonListLabel);
        this.buttonListLabel.appendChild(this.buttonList);

        this.search.appendChild(this.inputSearchLabel);
        this.search.appendChild(this.error);
        this.search.appendChild(this.list);
        this.search.appendChild(this.findAnswer);
        this.inputSearchLabel.appendChild(this.inputSearch);

        this.findAnswer.appendChild(this.headFindAnswer);
        this.findAnswer.appendChild(this.imgFindAnswer);
        this.headFindAnswer.appendChild(this.headFindAnswer__header);
        this.headFindAnswer.appendChild(this.brFind);
        this.headFindAnswer.appendChild(this.headFindAnswer__span);

        $.body.appendChild(this.divForm);

        changeVisible(this.buttonList, this.form, this.search);
        changeVisible(this.buttonSearch, this.search, this.form);

        this.itemsPerPage = 25;
        this.getData();
    }

    async getData() {
        const data = await fetch("https://pokeapi.co/api/v2/pokemon/?limit=1026").then(res => res.json());
        this.items = data.results;
    }

    async getPokemons(page) {
        const pokemons = [];
        const startIndex = page * this.itemsPerPage + 1;
        const endIndex = startIndex + this.itemsPerPage;

        for (let i = startIndex; i < endIndex; i++) {
            let promise = await fetch(`https://pokeapi.co/api/v2/pokemon/${i}/`).then(res => res.json());
            pokemons.push(promise);
        }

        this.pokemons = pokemons;
        return pokemons;
    }

    async createPokemonCards(currentPage) {
        const pokemons = await this.getPokemons(currentPage);

        pokemons.forEach((element, id) => {
            const card = document.createElement("div");
            const img = document.createElement("img");
            img.classList.add("img");
            const span = document.createElement("span");
            span.classList.add("span");
            card.classList.add("card");
            card.id = ++id;
            this.cards.appendChild(card);
            card.appendChild(span);
            card.appendChild(img);
            span.textContent = element.name;
            img.src = element.sprites.front_default;
        });
    }

}

const changeVisible = (button, remove, add) => {
    button.addEventListener("click", () => {
        remove.classList.remove("invisible");
        add.classList.add("invisible");
    })
}

customElements.define("my-element", Pokemons);
myElement = document.createElement("my-element");
document.body.appendChild(myElement);

document.addEventListener("submit", (e) => { e.preventDefault() });

document.addEventListener('DOMContentLoaded', async function () {
    await myElement.createPokemonCards(0);

    let currentPage = 0;

    function createPageButtons() {
        const totalPages = Math.ceil(myElement.items.length / myElement.itemsPerPage);
        const paginationContainer = document.createElement('div');
        const paginationDiv = document.body.appendChild(paginationContainer);
        paginationContainer.classList.add('pagination');

        for (let i = 0; i < totalPages - 1; i++) {
            const pageButton = document.createElement('button');
            pageButton.textContent = i + 1;
            pageButton.addEventListener('click', () => {
                currentPage = i;
                myElement.createPokemonCards(currentPage);
                myElement.cards.innerHTML = '';
                window.scrollTo(0, 0);
                updateActiveButtonStates();
            });

            myElement.form.appendChild(paginationContainer);
            paginationDiv.appendChild(pageButton);
        }
    }

    function updateActiveButtonStates() {
        const pageButtons = document.querySelectorAll('.pagination button');
        pageButtons.forEach((button, index) => {
            if (index === currentPage) {
                button.classList.add('active');
            } else {
                button.classList.remove('active');
            }
        });
    }

    createPageButtons();
});

const clean = () => {
    myElement.error.innerHTML = "";
    myElement.findAnswer.classList.add("hidden");
}

myElement.inputSearch.addEventListener("input", () => {
    const value = myElement.inputSearch.value.trim();
    myElement.list.innerHTML = "";
    clean();
    if (value.length < 3) return;
    setList(myElement.items);

    function setList(results) {
        let flag = false;
        for (const pokemon of results) {
            const name = pokemon.name.trim();
            myElement.list.classList.remove("invisible");
            if (name.includes(value)) {
                clean();
                const resultItem = document.createElement("li");
                resultItem.classList.add("resultItem");
                resultItem.textContent = name;
                myElement.list.appendChild(resultItem);
                resultItem.addEventListener("click", async () => {
                    myElement.findAnswer.classList.remove("hidden");
                    let infoPokemon = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}/`).then(res => res.json());
                    myElement.headFindAnswer__header.textContent = infoPokemon.name;
                    myElement.headFindAnswer__span.textContent = "base experience: " + infoPokemon.base_experience
                        + '\r\n' + "weight: " + infoPokemon.weight;
                    myElement.imgFindAnswer.src = infoPokemon.sprites.front_default;
                })
                flag = true;
            }
        }
        if (!flag) {
            const errorItem = document.createElement("span");
            errorItem.classList.add("error");
            errorItem.textContent = "Ничего не найдено, убедитесь, что вы пишите на английском";
            myElement.error.appendChild(errorItem);
        }

    }
})



