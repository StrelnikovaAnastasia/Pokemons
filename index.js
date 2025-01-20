const itemsPerPage = 25;
const buttonsPerPage = 3;

async function getData() {
    const data = await fetch("https://pokeapi.co/api/v2/pokemon/?limit=1026").then(res => res.json()).catch(() => alert("что-то пошло не так, обновите страницу"));
    console.log(data.results)
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

async function createPokemonCards(currentPage = 0) {
    const pokemons = await getPokemons(currentPage);

    pokemons.forEach((element, index) => {
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
        card.id = ++index;
        document.querySelector(".cards").appendChild(card);
        card.appendChild(span);
        card.appendChild(img);
        card.appendChild(typesPokemon);
        typesPokemon.appendChild(type);
        typesPokemon.appendChild(weakness);
        let firstLetter = element.name.charAt(0).toUpperCase();
        let lastWord = element.name.slice(1);
        span.textContent = firstLetter + lastWord;
        img.src = element.sprites.front_default;
        let types = [];
        console.log(element);
    
        element.types.forEach((el, ind) => {
            types[ind] = el.type.name;
        })
        type.classList.add(types[0]);
        weakness.classList.add(types[1]);
        type.textContent = types[0];
        weakness.textContent = types[1];
        types = [];
        card.addEventListener("click", async () => {
            document.querySelector(".bigCard").classList.remove("hidden");
            document.querySelector("#type1BigCard").className = " ";
            document.querySelector("#type2BigCard").className = " ";
            document.querySelector("#headerBigCard").textContent = firstLetter + lastWord;
            document.querySelector("#imgBigCard").src = element.sprites.front_default;
            let types = [];
            element.types.forEach((el, ind) => {
                types[ind] = el.type.name;
            })
            document.querySelector("#type1BigCard").classList.add(types[0], "type");
            document.querySelector("#type2BigCard").classList.add(types[1], "type");
            document.querySelector("#type1BigCard").textContent = types[0];
            document.querySelector("#type2BigCard").textContent = types[1];
            types = [];
            document.querySelector("#specificationsSpanHeight").textContent = element.height;
            document.querySelector("#specificationsSpanExperience").textContent = element.base_experience;
            document.querySelector("#specificationsSpanWeight").textContent = element.weight;
            element.abilities.forEach((el) => {
                if (el.is_hidden = "false") {
                    document.querySelector("#specificationsSpanAbilities").textContent = el.ability.name;
                }
            });
            let stats = [];
            element.stats.forEach((el, ind) => {
                stats[ind] = el.base_stat;
            })
            document.querySelector("#statsSpanHP").textContent = stats[0];
            document.querySelector("#statsSpanAttack").textContent = stats[1];
            document.querySelector("#statsSpanDefence").textContent = stats[2];
            document.querySelector("#statsSpanSpecialAttack").textContent = stats[3];
            document.querySelector("#statsSpanSpecialDefence").textContent = stats[4];
            document.querySelector("#statsSpanSpeed").textContent = stats[5];
        })
        document.querySelector(".closeButton").addEventListener("click", () => {
            document.querySelector(".bigCard").classList.add("hidden");
        })
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
    await createPokemonCards();
    var preloader = document.getElementById('preloader');
    preloader.style.display = 'none';
    async function createPageButtons() {
        let items = await getData();
        const totalPages = Math.ceil(items.length / itemsPerPage);
        function openList(pageButton) {
            let promise = null;
            pageButton.addEventListener('click', () => {
                preloader.style.display = 'flex';
                if (promise) return;
                if (!pageButton.textContent) return;
                let pro = document.querySelector(".bx-loader-circle");
                if (pro) pro.remove();
                let currentPageButton = Number(pageButton.textContent) - 1;
                promise = createPokemonCards(currentPageButton);
                promise.then(() => {
                    document.querySelector(".forLoad").classList.add("hidden");
                }).finally(() => {
                    promise = null
                    preloader.style.display = 'none';
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
                whenEnd = totalPages;
            }
            let currentPageButton = whenEnd - buttonsPerPage;
            changeOptionButton(currentPageButton, whenEnd, totalPages, pageButton);
        })
    }

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
                document.querySelector("#headerSearch").textContent = "загрузка данных...";
                document.querySelector("#spanSearch").textContent = "";
                document.querySelector("#imgSearch").src = "";
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



