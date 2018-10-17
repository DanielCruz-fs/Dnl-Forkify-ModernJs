import Search from './models/Search';
import Recipe from './models/Recipe';
import List from './models/List';
import * as searchView from './views/searchView';
import * as recipeView from './views/recipeView';
import { elements, renderLoader, clearLoader } from './views/base'; 

/** Global state managment of the app */
/**
 * Search object
 * Current recipe object
 * Shopping list object
 * Liked object
 */
const state = {};
/**
 * SEARCH CONTROLLER
 */
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
        try{
            //Search for recipes
            await state.search.getResults();
            //Render results on UI
            //console.log(state.search.result);
            clearLoader();
            searchView.renderResults(state.search.result);
            /**Cheking your login here */
            //console.log(state.search.query);
        }catch(err){
            alert('Something went wrong...');
            clearLoader();
        }
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
/**
 * RECIPE CONTROLLER
 */
const controlRecipe = async () => {
    const id = window.location.hash.replace('#', '');
    console.log(id);
    
    if(id){
        //Prepare UI for changes
        recipeView.clearRecipe();
        renderLoader(elements.recipe);
        //highlight selected search item
        if(state.search) searchView.highlightSelected(id);
        //Create a new recipe object
        state.recipe = new Recipe(id);

        try{
            //Get recipe data and parse ingredients
            await state.recipe.getRecipe();
            state.recipe.parseIngredients();
            //calculate servings and time
            state.recipe.calcTime();
            state.recipe.calcServings();
            //Render recipe
            //console.log(state.recipe);
            clearLoader();
            recipeView.renderRecipe(state.recipe);
        }catch(error){
            alert('Error processing recipe.');
        }
    }
};
window.addEventListener('hashchange', controlRecipe);
//this makes exceed your limit requests
// window.addEventListener('load', controlRecipe);

//Handling recipe button clicks
elements.recipe.addEventListener('click', e => {
    //state.recipe.updateServings('dec');
    if(e.target.matches('.btn-decrease, .btn-decrease *')){
        //decrease button is clicked
        if(state.recipe.servings > 1){
            state.recipe.updateServings('dec');
            recipeView.updateServingsIngredients(state.recipe);
        }
    }else if(e.target.matches('.btn-increase, .btn-increase *')){
        //increase button is clicked
        state.recipe.updateServings('inc');
        recipeView.updateServingsIngredients(state.recipe);
    }
    //console.log(state.recipe);
});
/**LIST CONTROLLER */
window.l = new List();
