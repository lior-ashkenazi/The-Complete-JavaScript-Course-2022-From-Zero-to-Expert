import icons from 'url:../../img/icons.svg'; // Parcel 2

export default class View {
    _data;

    render(data, render=true) {
        if (!data || (Array.isArray(data) && data.length === 0))
            return this.renderError();

        this._data = data;
        const markup = this._generateMarkup();

        if(!render) return markup

        this.#clear();
        this._parentEl.insertAdjacentHTML('afterbegin', markup);

    };

    update(data) {
        this._data = data;
        const newMarkup = this._generateMarkup();

        // the method converts HTML markup to a virtual DOM object
        // (that resides in memory) for manipulation and such
        const newDOM = document.createRange()
                               .createContextualFragment(newMarkup);
        const newElements = Array.from(newDOM.querySelectorAll('*'));
        const curElements = Array.from(this._parentEl.querySelectorAll('*'));
        newElements.forEach((newEl, i) => {
            const curEl = curElements[i];

            // Updates changed TEXT
            if (!newEl.isEqualNode(curEl) &&
                newEl.firstChild?.nodeValue.trim() !== '') {
                curEl.textContent = newEl.textContent;
            }

            // Updates changed ATTRIBUTES
            if (!newEl.isEqualNode(curEl))
                Array.from(newEl.attributes)
                     .forEach(attr => curEl.setAttribute(attr.name, attr.value));
        });
    }


    #clear() {
        this._parentEl.innerHTML = '';
    };

    renderSpinner() {
        const markup = `<div class='spinner'>
          <svg>
            <use href='${icons}#icon-loader'></use>
          </svg>
        </div>`;
        this.#clear();
        this._parentEl.insertAdjacentHTML('afterbegin', markup);
    };

    renderError(msg = this._errMsg) {
        const markup = `
<div class='error'>
            <div>
              <svg>
                <use href='${icons}#icon-alert-triangle'></use>
              </svg>
            </div>
            <p>${msg}</p>
          </div>`;
        this.#clear();
        this._parentEl.insertAdjacentHTML('afterbegin', markup);
    }

    renderMessage(msg = this._msg) {
        const markup = `
<div class='message'>
            <div>
              <svg>
                <use href='${icons}#icon-smile'></use>
              </svg>
            </div>
            <p>${msg}</p>
          </div>`;
        this.#clear();
        this._parentEl.insertAdjacentHTML('afterbegin', markup);
    }
}