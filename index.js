const itemsPerPage = 25;
const buttonsPerPage = 3;

async function getData() {
    const data = await fetch("https://pokeapi.co/api/v2/pokemon/?limit=1026").then(res => res.json());
    return data.results;
}

async function getPokemons(page) {
    const pokemons = [];
    const startIndex = page * itemsPerPage + 1;
    const endIndex = startIndex + itemsPerPage;

    for (let i = startIndex; i < endIndex; i++) {
        let pokemon = await fetch(`https://pokeapi.co/api/v2/pokemon/${i}/`).then(res => res.json());
        pokemons.push(pokemon);
    }
    return pokemons;
}

async function createPokemonCards(currentPage) {
    const pokemons = await getPokemons(currentPage);

    pokemons.forEach((element, index) => {
        const card = document.createElement("div");
        const img = document.createElement("img");
        img.classList.add("img");
        const buttonBigCard = document.createElement("button");
        buttonBigCard.classList.add("span");
        buttonBigCard.addEventListener("click", async () => {
            document.querySelector(".bigCard").classList.remove("hidden");
            document.querySelector("#headerBigCard").textContent = element.name;
            document.querySelector("#spanBigCard").textContent = "base experience: " + element.base_experience
                + '\r\n' + "weight: " + element.weight;
            document.querySelector("#imgBigCard").src = element.sprites.front_default;
        })
        document.querySelector(".closeButton").addEventListener("click", () => {
            document.querySelector(".bigCard").classList.add("hidden");
        })
        card.classList.add("card");
        card.id = ++index;
        document.querySelector(".cards").appendChild(card);
        card.appendChild(buttonBigCard);
        card.appendChild(img);
        buttonBigCard.textContent = element.name;
        img.src = element.sprites.front_default;
    });
}

const changeVisible = (button, remove, add) => {
    button.addEventListener("click", () => {
        remove.classList.remove("invisible");
        add.classList.add("invisible");
    })
}

let buttonList = document.querySelector(".bx-list-ul");
let buttonSearch = document.querySelector(".bx-search");
let form = document.querySelector("#form");
let search = document.querySelector(".form");

changeVisible(buttonList, form, search);
changeVisible(buttonSearch, search, form);

document.addEventListener("submit", (e) => { e.preventDefault() });

document.addEventListener('DOMContentLoaded', async function () {
    await createPokemonCards(0);

    async function createPageButtons() {
        let items = await getData();
        const totalPages = Math.ceil(items.length / itemsPerPage);

        function openList(pageButton) {
            pageButton.addEventListener('click', () => {
                if (!pageButton.textContent) return;
                let pro = document.querySelector(".bx-loader-circle");
                if (pro) pro.remove();
                let currentPageButton = Number(pageButton.textContent) - 1;
                const load = document.createElement("i");
                load.classList.add("bx", "bx-loader-circle", "bx-lg", "load");
                document.querySelector(".forLoad").appendChild(load);
                createPokemonCards(currentPageButton).then( () => {
                    document.querySelector(".forLoad").classList.add("hidden");
                });
                document.querySelector(".cards").innerHTML = '';
                window.scrollTo(0, 0);
                document.querySelector(".forLoad").classList.remove("hidden");
            });
        }

        const pageButton = Array.from(document.querySelector('.btn').getElementsByClassName("button"));
        pageButton.forEach((item) => openList(item));

        document.querySelector(".bxs-chevron-right").addEventListener("click", () => {
            let currentPageButton = Number(document.querySelector(".btn").lastElementChild.textContent);
            let whenEnd = currentPageButton + buttonsPerPage;
            changeOptionButton(currentPageButton, whenEnd, totalPages, pageButton);
        })

        document.querySelector(".bxs-chevron-left").addEventListener("click", () => {
            let whenEnd = Number(document.querySelector(".btn").firstElementChild.textContent) - 1;
            if (whenEnd == 0) {
                whenEnd = totalPages
            }
            let currentPageButton = whenEnd - buttonsPerPage;
            changeOptionButton(currentPageButton, whenEnd, totalPages, pageButton);
        })
    }

    // function updateActiveButtonStates(i) {
    //     const pageButtons = Array.from(document.querySelector('.btn').getElementsByClassName("button"));
    //     pageButtons.forEach((button) => {
    //         console.log(Number(button.textContent))
    //         console.log((currentPage));

    //         if (Number(button.textContent) === currentPage) {
    //             button.classList.add('active');
    //         } else {
    //             button.classList.remove('active');
    //         }
    //     });
    // }

    createPageButtons();
});

function changeOptionButton(currentPageButton, whenEnd, totalPages, pageButton) {
    for (let i = currentPageButton; i < whenEnd; i++) {
        if (i + 1 < totalPages) {
            pageButton[i - currentPageButton].textContent = i + 1;
        }
        else {
            pageButton[i - currentPageButton].textContent = "";
        }
    }
}

const clean = () => {
    document.querySelector("#error").innerHTML = "";
    document.querySelector(".findAnswer").classList.add("hidden");
}

let inputSearch = document.querySelector(".input");
inputSearch.addEventListener("input", async () => {
    const value = inputSearch.value.trim();
    document.querySelector(".list").innerHTML = "";
    clean();
    if (value.length < 3) return;
    let items = await getData();
    setList(items);

    function setList(results) {
        let flag = false;
        for (const pokemon of results) {
            const name = pokemon.name.trim();
            document.querySelector(".list").classList.remove("invisible");
            if (name.includes(value)) {
                clean();
                const resultItem = document.createElement("li");
                resultItem.classList.add("resultItem");
                resultItem.textContent = name;
                document.querySelector(".list").appendChild(resultItem);
                resultItem.addEventListener("click", async () => {
                    document.querySelector(".findAnswer").classList.remove("hidden");
                    let infoPokemon = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}/`).then(res => res.json());
                    document.querySelector("#headerSearch").textContent = infoPokemon.name;
                    document.querySelector("#spanSearch").textContent = "base experience: " + infoPokemon.base_experience
                        + '\r\n' + "weight: " + infoPokemon.weight;
                    document.querySelector("#imgSearch").src = infoPokemon.sprites.front_default;
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
})



