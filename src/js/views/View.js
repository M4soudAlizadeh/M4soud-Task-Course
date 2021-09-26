import icons from 'url:../../img/icons.svg'; // parcel 2

export default class View {
  _data;

  /**
   * render the recived object
   * @param {object | object []} data The data to be renderd (e.g. recipe)
   * @param {boolean} [render = true] if false, create markup string instead of rendering to the DOM
   * @returns {undefined | string} A markup string is returned if render is false
   * @this {object} View instance
   * @author M4soud
   * @todo finish implamentation
   */
  render(data, render = true) {
    if (!data || (Array.isArray(data) && data.length === 0))
      return this.renderError();
    this._data = data;
    const markup = this._generatMarkup();

    if (!render) return markup;

    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  update(data) {
    this._data = data;

    const newMarkup = this._generatMarkup();
    const newDom = document.createRange().createContextualFragment(newMarkup);
    const newElement = Array.from(newDom.querySelectorAll('*'));
    const currElement = Array.from(this._parentElement.querySelectorAll('*'));

    newElement.forEach((newEle, i) => {
      const curEle = currElement[i];
      // console.log(curEle, newEle.isEqualNode(curEle)); /////    compare method for new and curr elements

      // update chang Text
      if (
        !newEle.isEqualNode(curEle) &&
        newEle.firstChild?.nodeValue.trim() !== ''
      ) {
        // nodeValue return text content not attribute so there is cause dataset attribute not update
        curEle.textContent = newEle.textContent;
      }

      // update chang attributes
      if (!newEle.isEqualNode(curEle)) {
        Array.from(newEle.attributes).forEach(att =>
          curEle.setAttribute(att.name, att.value)
        );
      }
    });
  }
  _clear() {
    this._parentElement.innerHTML = '';
  }
  renderSpinner() {
    const markup = `
  <div class="spinner">
  <svg>
    <use href="${icons}#icon-loader"></use>
  </svg>
  </div>`;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  renderError(message = this._errorMessage) {
    const markup = `
    <div class="error">
      <div>
          <svg>
            <use href="${icons}#icon-alert-triangle"></use>
          </svg>
        </div>
        <p> ${message} </p>
      </div>`;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  renderMessage(message = this._message) {
    const markup = `
    <div class="message">
      <div>
          <svg>
            <use href="${icons}#icon-smile"></use>
          </svg>
        </div>
        <p> ${message} </p>
      </div>`;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }
}
