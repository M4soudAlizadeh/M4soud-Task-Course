import * as model from './model.js';
import recipeView from './views/recipeView.js';
import SearchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import bookMarksView from './views/bookMarksView.js';
import paginationView from './views/paginationView.js';
import addRecipeView from './views/addRecipeView.js';
import { MODAL_CLOSE_SEC } from './config.js';
import 'core-js/stable';
import 'regenerator-runtime/runtime';
import { async } from 'regenerator-runtime';

///////////////////////////////////////

const controllRecipe = async function () {
  try {
    const id = window.location.hash.slice(1);
    if (!id) return;
    recipeView.renderSpinner();

    // 0) update result View
    resultsView.update(model.getSearchResultsPage());
    bookMarksView.update(model.state.bookMarks);

    // 1) Loading Recipe
    await model.loadRecipe(id);

    recipeView.render(model.state.recipe);

    // const { recipe } = model.state;

    // 2) rendering recipe
  } catch (err) {
    recipeView.renderError();
    console.error(err);
  }
};

const controlSearchResult = async function () {
  try {
    // ResultsView.renderSpinner();

    const query = SearchView.getQuery();
    if (!query) return;
    await model.loadSearchResult(query);
    resultsView.render(model.getSearchResultsPage());
    paginationView.render(model.state.search);
  } catch (err) {
    console.error(err);
  }
};

const controllerPagination = function (goToPage) {
  resultsView.render(model.getSearchResultsPage(goToPage));
  paginationView.render(model.state.search);
};

const controllServings = function (newServings) {
  // update Servings in data
  model.updateServing(newServings);

  //update the recipe view
  recipeView.update(model.state.recipe);
};

const controllAddBookMarks = function () {
  // add/delete bookmarks
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.deleteBookMark(model.state.recipe.id);

  // update bookmarks
  recipeView.update(model.state.recipe);

  // render bookmarks
  bookMarksView.render(model.state.bookMarks);
};

const controllBookmarks = function () {
  bookMarksView.render(model.state.bookMarks);
};

const controllAddRecipe = async function (newRecipe) {
  try {
    addRecipeView.renderSpinner();

    await model.uploadRecipe(newRecipe);
    recipeView.render(model.state.recipe);

    addRecipeView.renderMessage();

    bookMarksView.render(model.state.recipe);

    // chang id in url
    window.history.pushState(null, '', `#${model.state.recipe.id}`);
    // other way
    // window.history.back();

    setTimeout(function () {
      addRecipeView.toggleWindowOverlay();
    }, MODAL_CLOSE_SEC * 1000);
  } catch (err) {
    console.error('🤬', err);
    addRecipeView.renderError(err.message);
  }
};

const init = function () {
  bookMarksView._addHandlerRender(controllBookmarks);
  recipeView.addHandlerRender(controllRecipe);
  recipeView.addHandlerUpdateServings(controllServings);
  recipeView.addHandlerAddBookmark(controllAddBookMarks);
  SearchView.addhandlerSearch(controlSearchResult);
  paginationView.addhandlerClick(controllerPagination);
  // AddRecipeView.addHandlerUpload(controllAddRecipe);
  console.log('Welcome!');
};
init();

// window.addEventListener('hashchange', showRecipe);
// window.addEventListener('load', showRecipe);
