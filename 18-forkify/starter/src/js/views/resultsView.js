import View from './view';
import previewView from './previewView';
import icons from 'url:../../img/icons.svg'; // Parcel 2

class ResultsView extends View {
  _parentEl = document.querySelector('.results');
  _errMsg = 'No recipes found for you query! Please try again.';
  _msg = '';

  _generateMarkup() {
    return this._data.map(res=>previewView.render(res, false)).join('');
  }
}

export default new ResultsView();