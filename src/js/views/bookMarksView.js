import View from './View.js';
import icons from 'url:../../img/icons.svg'; // parcel 2
import previewView from './previewView.js';

class BookMarksView extends View {
  _parentElement = document.querySelector('.bookmarks__list');
  _errorMessage = 'No BookMarks yet!👀 Please add recipe!';
  _message = '';

  _addHandlerRender(handler) {
    window.addEventListener('load', handler);
  }
  _generatMarkup() {
    return this._data
      .map(bookmark => previewView.render(bookmark, false))
      .join('');
  }
}

export default new BookMarksView();
