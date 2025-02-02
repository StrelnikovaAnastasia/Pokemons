export class Pokemons {
    itemsPerPage = 25;

    async getByPage(pageNumber) {
        const pokemons = [];
        let infoPokemons = await fetch(`https://pokeapi.co/api/v2/pokemon/?limit=25&offset=${pageNumber*25}/`).then(res => res.json());
        infoPokemons.results.forEach(element => {
            pokemons.push(fetch(element.url).then(res => res.json()));
        });
        return pokemons;
    }

    async getAll() {
        const data = await fetch("https://pokeapi.co/api/v2/pokemon/?limit=1026").then(res => res.json()).catch(() => alert("что-то пошло не так, обновите страницу"));
        return data.results;
    }

    async getBySearch(results) {
        const pokemons = [];
        for (const element of results) {
            let pokemon = await fetch(`https://pokeapi.co/api/v2/pokemon/${element.name}/`).then(res => res.json());
            pokemons.push(pokemon);
        }
        return pokemons;
    }
}