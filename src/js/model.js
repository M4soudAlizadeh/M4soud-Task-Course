import { async } from 'regenerator-runtime';

import { API_URL, RESULT_PER_PAGE, KEY } from './config.js';
import { getJSON, sendJSON } from './helpers.js';
// import { AJAX } from './helpers.js';

export const state = {
  recipe: {},
  search: {
    query: '',
    result: [],
    resultPerPage: RESULT_PER_PAGE,
    page: 1,
  },
  bookMarks: [],
};

const creatRecipeObject = function (data) {
  const { recipe } = data.data;
  return {
    id: recipe.id,
    title: recipe.title,
    publisher: recipe.publisher,
    sourceUrl: recipe.source_url,
    image: recipe.image_url,
    servings: recipe.servings,
    cookingTime: recipe.cooking_time,
    ingredients: recipe.ingredients,
    ...(recipe.key && { key: recipe.key }),
  };
};
export const loadRecipe = async function (id) {
  try {
    const data = await getJSON(`${API_URL}${id}`);
    state.recipe = creatRecipeObject(data);

    if (state.bookMarks.some(bookmark => bookmark.id === id))
      state.recipe.bookmarked = true;
    else state.recipe.bookmarked = false;
  } catch (err) {
    throw err;
  }
};

export const loadSearchResult = async function (query) {
  try {
    state.search.query = query;
    const data = await getJSON(`${API_URL}?search=${query}`);

    state.search.result = data.data.recipes.map(rec => {
      return {
        id: rec.id,
        title: rec.title,
        publisher: rec.publisher,
        image: rec.image_url,
        ...(rec.key && { key: rec.key }),
      };
    });
    state.search.page = 1;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

export const getSearchResultsPage = function (page = state.search.page) {
  state.search.page = page;
  const start = (page - 1) * state.search.resultPerPage; //0
  const end = page * state.search.resultPerPage; // 9
  return state.search.result.slice(start, end);
};

export const updateServing = function (newServings) {
  state.recipe.ingredients.forEach(ing => {
    ing.quantity = (ing.quantity * newServings) / state.recipe.servings;
  });

  state.recipe.servings = newServings;
};

const persistBookmarks = function () {
  localStorage.setItem('bookmarks', JSON.stringify(state.bookMarks));
};

export const addBookmark = function (recipe) {
  // update recipe
  state.bookMarks.push(recipe);

  // mark current recipe as bookMarked
  if (recipe.id === state.recipe.id) state.recipe.bookmarked = true;
  persistBookmarks();
};

export const deleteBookMark = function (id) {
  // delete bookmark
  const index = state.bookMarks.findIndex(el => el.id === id);
  state.bookMarks.splice(index, 1);

  // mark current recipe as not bookMarked
  if (id === state.recipe.id) state.recipe.bookmarked = false;
  persistBookmarks();
};

const clearBookmarks = function () {
  localStorage.clear('bookmarks');
};
clearBookmarks();

const getBookmarksFromLocal = function () {
  const storage = localStorage.getItem('bookmarks');
  if (storage) state.bookMarks = JSON.parse(storage);
};
getBookmarksFromLocal();

export const uploadRecipe = async function (newRecipe) {
  try {
    const ingredients = Object.entries(newRecipe)
      .filter(entry => entry[0].startsWith('ingredient') && entry[1] !== '')
      .map(ing => {
        const ingArr = ing[1].split(',').map(el => el.trim());
        // const ingArr = ing[1].replaceAll(' ', '').split(',');

        if (ingArr.length !== 3) throw new Error('Wrong ingredient format');
        const [quantity, unit, description] = ingArr;
        return { quantity: quantity ? +quantity : null, unit, description };
      });

    const recipe = {
      title: newRecipe.title,
      publisher: newRecipe.publisher,
      sourceUrl: newRecipe.source,
      image: newRecipe.image,
      servings: +newRecipe.servings,
      cookingTime: +newRecipe.cookingTime,
      ingredients,
    };

    const data = await sendJSON(`${API_URL}`, recipe);
    state.recipe = creatRecipeObject(data);
    addBookmark(state.recipe);
  } catch (err) {
    throw err;
  }
};
