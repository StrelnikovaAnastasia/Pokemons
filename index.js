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

        // this.footer = $.createElement("footer");
        // this.footer.classList.add("footer");

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

        this.buttonFindLabel = $.createElement("label");
        this.buttonFind = $.createElement("button");
        this.buttonFind.classList.add("button", "buttonSearch");
        this.buttonFind.textContent = "Найти";

        this.error = $.createElement("div");

        this.divForm.appendChild(this.form);
        this.divForm.appendChild(this.search);
        this.divForm.appendChild(this.list);
        this.form.appendChild(this.head);
        this.head.appendChild(this.header);
        this.head.appendChild(this.buttonSearchLabel);
        this.buttonSearchLabel.appendChild(this.buttonSearch);
        this.form.appendChild(this.cards);
        this.form.appendChild(this.br);
        //this.form.appendChild(this.footer);
        this.header.appendChild(this.h2);
        // this.footer.appendChild(this.btn);
        // this.btn.appendChild(this.buttonListLabel);
        // this.buttonListLabel.appendChild(this.buttonList);
        // this.btn.appendChild(this.buttonSearchLabel);
        // this.buttonSearchLabel.appendChild(this.buttonSearch);
        this.search.appendChild(this.headSearch);
        this.search.appendChild(this.brSearch);
        this.headSearch.appendChild(this.titleSearch);
        this.headSearch.appendChild(this.buttonListLabel);
        this.buttonListLabel.appendChild(this.buttonList);
        this.search.appendChild(this.inputSearchLabel);
        this.search.appendChild(this.buttonFindLabel);
        this.search.appendChild(this.error);
        //this.search.appendChild(this.footer);
        this.inputSearchLabel.appendChild(this.inputSearch);
        this.buttonFindLabel.appendChild(this.buttonFind);

        $.body.appendChild(this.divForm);

        // changeVisible(this.buttonList,this.form.classList,this.search);
        // changeVisible(this.buttonSearch,this.search.classList,this.form);

        this.buttonList.addEventListener("click", () => {
            this.form.classList.remove("invisible");
            this.search.classList.add("invisible");
        })

        this.buttonSearch.addEventListener("click", () => {
            this.search.classList.remove("invisible");
            this.form.classList.add("invisible");

        })
    }

    async getPokemons() {
        const pokemons = [];
        let data = await fetch("https://pokeapi.co/api/v2/pokemon/?limit=1026").then(res => res.json());
        let results = data.results;
        console.log(results);
        for (let poke of results) {
            let promise = await fetch(poke.url).then(res => res.json());
            pokemons.push(promise);
        }
        this.pokemons = pokemons;
        return pokemons;
    }

    async createPokemonCards() {
        const pokemons = await this.getPokemons();

        pokemons.forEach((element, id) => {
            const card = document.createElement("div");
            const img = document.createElement("img");
            img.classList.add("img");
            const span = document.createElement("span");
            span.classList.add("span");
            card.classList.add("card");
            card.id = id;
            this.cards.appendChild(card);
            card.appendChild(span);
            card.appendChild(img);
            span.textContent = element.name;
            img.src = element.sprites.front_default;
        });
    }

}

const changeVisible = (button, delet, add) => {
    button.addEventListener("click", () => {
        add.classList.add("invisible");
        delet.classList.remove("invisible");
    })
}

customElements.define("my-element", Pokemons);
myElement = document.createElement("my-element");
document.body.appendChild(myElement);

const isWords = (str) => /^[a-zA-Z]*$/.test(str);

document.addEventListener("submit", (e) => { e.preventDefault() });

document.addEventListener('DOMContentLoaded', async function () {

    await myElement.createPokemonCards();

    const content = document.querySelector('.cards');
    const itemsPerPage = 12;
    let currentPage = 0;

    const items = Array.from(content.getElementsByTagName('div'));

    function showPage(page) {
        const startIndex = page * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        items.forEach((item, index) => {
            item.classList.toggle('hidden', index < startIndex || index >= endIndex);
        });
        updateActiveButtonStates();
    }

    function createPageButtons() {
        const totalPages = Math.ceil(items.length / itemsPerPage);
        const paginationContainer = document.createElement('div');
        const paginationDiv = document.body.appendChild(paginationContainer);
        paginationContainer.classList.add('pagination');

        for (let i = 0; i < totalPages; i++) {
            const pageButton = document.createElement('button');
            pageButton.textContent = i + 1;
            pageButton.addEventListener('click', () => {
                pageButton.classList.add("active");
                currentPage = i;
                showPage(currentPage);
                window.scrollTo(0, 0);
                updateActiveButtonStates();
            });

            content.appendChild(paginationContainer);
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
    showPage(currentPage);
});

myElement.inputSearch.addEventListener("input", () => {
    const value = myElement.inputSearch.value.trim();
    if (value.length < 3) {
        myElement.list.innerHTML = "";
        myElement.error.innerHTML = "";
        return;
    }
    setList(myElement.pokemons);

    function setList(results) {
        myElement.list.innerHTML = "";
        myElement.error.innerHTML = "";
        const cardPokemon = Array.from(document.querySelector(".cards").getElementsByClassName("card"));
        for (const pokemon of results) {
            const name = pokemon.name.trim();
            myElement.list.classList.remove("invisible");
            if (!value || !isWords(value)) {
                const errorItem = document.createElement("span");
                errorItem.classList.add("error");
                errorItem.textContent = "Ничего не найдено, убедитесь, что вы пишите на английском";
                myElement.error.appendChild(errorItem);
            }
            if (name.includes(value)) {
                myElement.error.innerHTML = "";
                const resultItem = document.createElement("li");
                resultItem.classList.add("resultItem");
                resultItem.textContent = name;
                myElement.list.appendChild(resultItem);
                resultItem.addEventListener("click", ()=> {
                    let index;
                    cardPokemon.forEach(item => {
                        const names = item.getElementsByTagName("span");
                        const name = names[0].textContent;
                        const id = item.id;
                        if(resultItem.textContent === name) {
                            console.log(id)
                            index = id;
                        }
                    })
                    myElement.search.appendChild(document.getElementById(index));
                })
            }
    
        }
    }
})



