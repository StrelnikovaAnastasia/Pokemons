import './DevFragmentPokemon.js';
import './DevFragmentPokemons.js';
import './DevFragmentPagination.js';

document.addEventListener('submit', (e) => {
    e.preventDefault();
});

document.addEventListener('DOMContentLoaded', async () => {
    const pokemons = document.querySelector('.cards');
    pokemons.setActive(true);

    const pagination = document.querySelector('.form-pagination');
    pagination.setActive(true);
});
