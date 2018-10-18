import Search from './models/Search';
import Recipe from './models/Recipe';
import List from './models/List';
import Likes from './models/Likes';
import * as searchView from './views/searchView';
import * as recipeView from './views/recipeView';
import * as listView from './views/listView';
import { elements, renderLoader, clearLoader } from './views/base'; 

/** Global state managment of the app */
/**
 * Search object
 * Current recipe object
 * Shopping list object
 * Liked object
 */
const state = {};
//window.l = state;
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
window.addEventListener('load', controlRecipe);

/**LIST CONTROLLER */
const controlList = () => {
    //create a new list If there is none yet
    if(!state.list) state.list = new List();
    //add each ingredient to the list and UI
    state.recipe.ingredients.forEach(el => {
        const item = state.list.addItem(el.count, el.unit, el.ingredient);
        listView.renderItem(item);
    });
};
//Handling delete and update list item events
elements.shopping.addEventListener('click', e => {
    const id = e.target.closest('.shopping__item').dataset.itemid;
    //handle the delete button
    if(e.target.matches('.shopping__delete, .shopping__delete *')){
        //delete from state
        state.list.deleteItem(id);
        //delete from UI
        listView.deleteItem(id);
    //handle count update    
    }else if(e.target.matches('.shopping__count-value')){
        const val = parseFloat(e.target.value, 10);
        state.list.updateCount(id,val);
    }
});

/**LIKE CONTROLLER */
const controlLike = () => {
    if(!state.likes) state.likes = new Likes();
    const currentID = state.recipe.id;
    //User has not liked current recipe yet
    if(!state.likes.isLiked(currentID)){
        //add like to the state
        const newLike = state.likes.addLike(
            currentID, 
            state.recipe.title,
            state.recipe.author,
            state.recipe.img 
        );
        //toggle the like button
        //add like to UI
        console.log(state.likes);
    //User has liked the current recipe
    }else{
        //remove like from the state
        state.likes.deleteLike(currentID);
        //toggle the like button
        //remove like from the UI list
        console.log(state.likes);
    } 
};

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
    }else if (e.target.matches('.recipe__btn--add, .recipe__btn--add *')){
        //add ingredients to shop list
        controlList();  
    }else if (e.target.matches('.recipe__love, .recipe__love *')){
        //like controller
        controlLike();
    }
   
});

