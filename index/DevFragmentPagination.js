import { DevFragment } from './DevFragment.js';

export class DevFragmentPagination extends DevFragment {
    buttonsPerPage = 3;
    promise;

    constructor() {
        super();
    }

    render(data) {
        this.createPageButtons();
    }

    async load() {
        const data = await fetch(
            'https://pokeapi.co/api/v2/pokemon/?limit=1026'
        ).then((res) => res.json());
        return data.results;
    }

    async createPageButtons() {
        const itemsPerPage = 25;
        let items = await this.load();
        const totalPages = Math.ceil(items.length / itemsPerPage);

        const pageButton = Array.from(
            document.querySelector('.btn').getElementsByClassName('button')
        );
        pageButton.forEach((item) => this.clickOnPageNumber(item));
        this.clickOnArrow(pageButton, totalPages);
    }

    clickOnPageNumber(pageButton) {
        pageButton.addEventListener('click', () => {
            if (this.promise) return;
            if (!pageButton.textContent) {
                return;
            }

            this.loader.startLoading();
            let currentPageButton = parseInt(pageButton.textContent) - 1;
            this.promise = document
                .querySelector('.cards')
                .createPokemonCards(currentPageButton)
                .catch(() =>
                    alert(
                        'Произошла ошибка, обновите страницу и попробуйте еще раз'
                    )
                )
                .finally(() => {
                    this.promise = null;
                });
            const cards = document.querySelectorAll('.card');
            cards.forEach((card) => card.remove());
            window.scrollTo(0, 0);
        });
    }

    clickOnArrow(pageButton, totalPages) {
        document
            .querySelector('.bxs-chevron-right')
            .addEventListener('click', () => {
                let currentPageButton = Number(
                    document.querySelector('.btn').lastElementChild.textContent
                );
                let whenEnd = currentPageButton + this.buttonsPerPage;
                this.changeOptionButton(
                    currentPageButton,
                    whenEnd,
                    totalPages,
                    pageButton
                );
            });

        document
            .querySelector('.bxs-chevron-left')
            .addEventListener('click', () => {
                let whenEnd =
                    Number(
                        document.querySelector('.btn').firstElementChild
                            .textContent
                    ) - 1;
                if (whenEnd == 0) {
                    whenEnd = totalPages;
                }
                let currentPageButton = whenEnd - this.buttonsPerPage;
                this.changeOptionButton(
                    currentPageButton,
                    whenEnd,
                    totalPages,
                    pageButton
                );
            });
    }

    changeOptionButton(currentPageButton, whenEnd, totalPages, pageButton) {
        for (let i = currentPageButton; i < whenEnd; i++) {
            if (i + 1 < totalPages) {
                pageButton[i - currentPageButton].textContent = i + 1;
            } else {
                pageButton[i - currentPageButton].textContent = '';
            }
        }
    }
}
customElements.define('dev-fragment-pagination', DevFragmentPagination);
