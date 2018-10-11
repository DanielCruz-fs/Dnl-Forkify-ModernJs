import axios from 'axios';

async function getResults(query){
    const proxy = 'https://cors-anywhere.herokuapp.com/';
    const key = '3351c471d6a1cbd4c1ed504d164c0ec0';
    try{
        const res = await axios(`${proxy}https://www.food2fork.com/api/search?key=${key}&q=${query}`);
        const recipes = res.data.recipes;
        console.log(recipes);
    }catch(error){
        alert(error);
    }
};
getResults('vegan');