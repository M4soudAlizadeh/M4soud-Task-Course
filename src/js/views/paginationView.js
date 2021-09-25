import View from './View.js';
import icons from 'url:../../img/icons.svg'; // parcel 2

class PaginationView extends View {
  _parentElement = document.querySelector('.pagination');

  addhandlerClick(handler) {
    this._parentElement.addEventListener('click', function (e) {
      const btn = e.target.closest('.btn--inline');
      if (!btn) return;
      const goToPage = +btn.dataset.goto;
      handler(goToPage);
    });
  }
  _generatMarkup() {
    const currPage = this._data.page;
    const numPage = Math.ceil(
      this._data.result.length / this._data.resultPerPage
    );

    const next = `
    <button data-goto="${
      currPage + 1
    }" class="btn--inline pagination__btn--next">
          <span>Page ${currPage + 1}</span>
          <svg class="search__icon">
            <use href="${icons}#icon-arrow-right"></use>
          </svg>
    </button>`;

    const prev = `
      <button data-goto="${
        currPage - 1
      }" class="btn--inline pagination__btn--prev">
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-left"></use>
            </svg>
            <span>Page ${currPage - 1}</span>
      </button>`;

    //  if more than 10 results and in the page number 1
    if (currPage === 1 && numPage > 1) {
      return next;
    }
    //  if in the last page
    if (currPage === numPage) {
      return prev;
    }

    //  if in the page except number 1 and last page
    if (currPage !== 1 && currPage !== numPage) {
      return [prev, next];
    }

    //  if less 10 result
    return '';
  }
}
export default new PaginationView();
