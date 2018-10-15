import Search from './models/Search';
import * as searchView from './views/searchView';
import { elements, renderLoader, clearLoader } from './views/base'; 

/** Global state managment of the app */
/**
 * Search object
 * Current recipe object
 * Shopping list object
 * Liked object
 */
const state = {};

const controlSearch = async () => {
    //Get query from view
    const query = searchView.getInput();
    //console.log(query);
    if(query){
        //New search object and add to state
        state.search = new Search(query);
        //Prepare UI for results
        searchView.clearInput();
        searchView.clearResults();
        renderLoader(elements.searchRes);
        //Search for recipes
        await state.search.getResults();
        //Render results on UI
        //console.log(state.search.result);
        clearLoader();
        searchView.renderResults(state.search.result);
        /**Cheking your login here */
        //console.log(state.search.query);
    }
};

elements.searchForm.addEventListener('submit', e => {
    e.preventDefault();
    controlSearch();
});

elements.searchResPages.addEventListener('click', e => {
    const btn = e.target.closest('.btn-inline');
    if(btn){
        const goToPage = parseInt(btn.dataset.goto, 10);
        searchView.clearResults();
        searchView.renderResults(state.search.result, goToPage);
        //console.log(goToPage);
    }
});