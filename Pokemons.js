export class Pokemons {
    itemsPerPage = 25;

    async getByPage(pageNumber) {

        const pokemons = [];
        const startIndex = pageNumber * this.itemsPerPage + 1;
        const endIndex = startIndex + this.itemsPerPage;

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