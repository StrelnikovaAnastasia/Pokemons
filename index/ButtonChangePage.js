import { $ } from "./$.js";

export class ButtonChangePage {
    clickOnButton() {
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
}