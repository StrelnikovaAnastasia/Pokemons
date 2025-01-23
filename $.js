export class $ {
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

    appendChild(child) {
        this.#element.appendChild(child);
    }

}