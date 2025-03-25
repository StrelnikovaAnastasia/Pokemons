const timeoutDelay = 400;

export class DevLoader extends HTMLElement {
    connectedCallback() {
        this.loader = this.querySelector('.loader');
    }

    startLoading() {
        this.innerHTML = 'загрузка';
        this.setAttribute('active', true);
    }

    endLoading() {
        this.removeAttribute('active');
        this.setAttribute('deactive', true);
        setTimeout(() => {
            this.removeAttribute('deactive');
        }, timeoutDelay);
    }
}

customElements.define('dev-loader', DevLoader);

export class DevFragment extends HTMLElement {
    constructor() {
        super();
        this.active = this.getAttribute('active');
        this.isLoad = false;

        this.loader = document.createElement('dev-loader');
        this.loader.classList.add('dev-loader');

        this.url = [];
        this.requestBody = null;

        this.upperTab = this.querySelector('dev-uppertab');
        this.errorBlock = null;

        this.bottomSheet = document.querySelector('dev-bottom-sheet');
        this.bottomSheetClass = '';
    }

    connectedCallback() {
        let mdCircularProgress = document.createElement('md-circular-progress');
        mdCircularProgress.setAttribute('indeterminate', '');

        this.loader.appendChild(mdCircularProgress);
        this.appendChild(this.loader);
    }

    getIsLoad() {
        return this.isLoad;
    }

    setIsLoad(state) {
        this.isLoad = state;
    }

    setUrl(url) {
        this.url = url;
    }
    setRequestBody(body) {
        this.requestBody = body;
    }

    rerender() {
        this.appendChild(this.loader);
        this.classList.add('load');
        this.loader.startLoading();

        this.load()
            .then((data) => {
                this.isLoad = true;
                this.render(data);
                this.loader.endLoading();
                this.classList.remove('load');
            })
            .catch((error) => {
                this.renderError();
                this.loader.endLoading();
                this.classList.remove('load');
            });
    }

    async setActive(active) {
        if (!this.isLoad && active) {
            this.classList.add('load');
            this.loader.startLoading();

            if (this.errorBlock) {
                this.querySelector('.error').remove();
                this.errorBlock = null;
            }

            await this.load()
                .then((data) => {
                    this.isLoad = true;
                    this.render(data);
                    this.loader.endLoading();
                    this.classList.remove('load');
                })
                .catch((error) => {
                    this.renderError();
                    this.loader.endLoading();
                    this.classList.remove('load');
                });
        }

        if (this.active && active) {
            return;
        } else if (active) {
            this.setAttribute('active', active);
            // this.bottomSheet.className = this.bottomSheetClass;
        } else {
            this.removeAttribute('active');
        }

        if (this.active && !active) {
            this.setAttribute('deactive', true);
            setTimeout(() => {
                this.removeAttribute('deactive');
            }, timeoutDelay);
        }
        this.active = active === 'true' ? true : false;
    }

    renderError() {
        if (!this.errorBlock) {
            this.errorBlock = document.createElement('div');
            this.errorBlock.classList.add('error');

            this.errorBlock.innerHTML =
                "<p class = 'error__title'>Ошибка загрузки</p><p class = 'error__content'>Попробуйте позднее</p>";
            this.appendChild(this.errorBlock);
        }
    }

    load() {
        return new Promise((res) => {
            if (Array.isArray(this.url)) {
                // console.log(this.url);
                let resData = {}; // Объект для хранения данных с ключами-URL

                // Массив промисов для всех запросов
                let promises = this.url.map((urlItem) => {
                    return this.loadData(urlItem).then((data) => {
                        // console.log(resData);
                        // console.log(data);
                        // console.log(typeof data);
                        // console.log(Array.isArray(data));

                        resData[urlItem] = data; // Сохраняем данные с ключом-URL
                    });
                });

                // Дожидаемся выполнения всех запросов
                Promise.all(promises).then(() => {
                    // console.log('Все данные загружены:', resData);
                    res(resData); // Возвращаем объект с данными
                });
            } else {
                this.loadData(this.url).then((data) => res(data));
            }
        });
    }

    loadData(url) {
        return new Promise((resolve, reject) => {
            fetch(
                url,
                this.requestBody
                    ? {
                          method: 'POST',
                          headers: {
                              'Content-Type': 'application/json',
                          },
                          body: JSON.stringify(this.requestBody),
                      }
                    : {}
            )
                .then((response) => {
                    if (!response.ok) {
                        throw new Error(
                            `HTTP error. Status: ${response.status}`
                        );
                    }
                    return response.json();
                })
                .then((data) => {
                    resolve(data);
                })
                .catch((error) => {
                    reject(error);
                });
        });
    }

    handleAction(action) {
        switch (action) {
            case 'right':
                this.upperTab.showNext();
                return;
            case 'left':
                this.upperTab.showPrevious();
                return;
        }
    }
}

customElements.define('dev-fragment', DevFragment);