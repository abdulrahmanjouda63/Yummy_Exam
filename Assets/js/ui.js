import { Meal, Category, Area, Ingredient, MealWithAll } from "./classes.js";

// Select elements from HTML
const mealDetailsSection = document.querySelector('#mealDetails .body-to-fill');
const allMealsSection = document.querySelector('#home .body-to-fill');
const categoriesSection = document.querySelector('#categories .body-to-fill');
const areasSection = document.querySelector('#areas .body-to-fill');
const ingredientsSection = document.querySelector('#ingredients .body-to-fill');
//Main Section
const homeSec = document.querySelector('#home .body-to-fill');
const searchSec = document.querySelector('#search');
const categoriesSec = document.querySelector('#categories');
const areasSec = document.querySelector('#areas');
const ingredientsSec = document.querySelector('#ingredients');
const contactSec = document.querySelector('#contact');
const mealDetailsSec = document.querySelector('#mealDetails');
const loadingSec = document.querySelector('#loading');

//Initialize global variables
var meal;
var mealsList;
var categoriesList;
var areasList;
var ingredientsList;



//get meal's details from API by id
/**
 * 
 * @param {Number} str - meal id
 */
export async function getMealDetails(id = '52772') {
    const url = `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`;

    try {
        const response = await fetch(url);
        const result = await response.json();
        const mealDetails = result.meals[0];

        meal = new Meal(mealDetails.idMeal, mealDetails.strMeal, mealDetails.strCategory, mealDetails.strArea, mealDetails.strInstructions, mealDetails.strMealThumb, mealDetails.strTags, mealDetails.strYoutube, mealDetails.strSource);
        meal.ingredients = meal.getValuesFromObj_usingRegex(mealDetails, /strIngredient/);
        meal.ingrMeasures = meal.getValuesFromObj_usingRegex(mealDetails, /strMeasure/);
        return meal;

    } catch (error) {
        console.error(error);
    }
}

//show meal's details from API in section
/**
 * 
 * @param {Number} str - meal id
 * post params to the inner callback function => (getMealDetails())
 */
export async function displayMealDetails(id) {
    try {
        const meal = await getMealDetails(id);

        /* loop for all ingredients and measures */
        let measures_ingresients = '';
        for(let i = 0; i < meal.ingredients.length; i++) {
            measures_ingresients += `
                <li class="alert alert-info p-2 me-3"><span class="meal-ingredient-measure">${meal.ingrMeasures[i]}</span> <span id="meal-ingredient">${meal.ingredients[i]}</span></li>
            `
        }

        var mealDetailsContainer = `
            <div class="col-md-4">
                <div><img class="w-100 img-fluid rounded-3" src="${meal.thumbnail}" alt="${meal.title}"></div>
                <h3 id="meal-title">${meal.title}</h3>
            </div>
            <div class="col-md-8">
                <h3>Instructions</h3>
                <p id="meal-instructions">${meal.description}</p>
                <h3><span class="fw-bolder">Area: </span><span id="meal-area">${meal.area}</span></h3>
                <h3><span class="fw-bolder">Category: </span><span id="meal-category">${meal.category}</span></h3>
                <h3>Recipes:</h3>
                <ul class="list-unstyled d-flex flex-wrap">
                    ${measures_ingresients}
                </ul>
                <h3>Tags:</h3>
                <div>
                    <a id="meal-source" href="${meal.source}" target="_blank" role="button" class="btn btn-success me-2 ${!meal.source? 'pe-none' : ''}">Source</a>
                    <a id="meal-youtube" href="${meal.youtube}" target="_blank" role="button" class="btn btn-danger">youtube</a>
                </div>
            </div>
            `;

        mealDetailsSection.innerHTML = mealDetailsContainer;
        
        show_hide(mealDetailsSec, homeSec, searchSec, categoriesSec, areasSec, ingredientsSec, contactSec, loadingSec);
    } catch (error) {
        console.error(error);
    }
}

//get all meals
/**
 * 
 * @param {String} val - query value for each key type
 * @param {String} key - query key (c for categoryies || a for areas || i for ingredients)
 * @param {String} str - url endpoint (search || filter)
 */
export async function getAllMeals(val = '', key = 's', str = 'search') {
    const url =    `https://www.themealdb.com/api/json/v1/1/${str}.php?${key}=${val}`;

    try {
        const response = await fetch(url);
        const result = await response.json();
        const meals = result.meals;

        mealsList= [];
        // let maxArrLength = 20;
        // if(meals.length <= maxArrLength) return maxArrLength = meals.length; //this was wrong and made displayallmeals function not working with everytime for requests with less length
        const maxArrLength = Math.min(20, meals.length); // Ensure max is 20 or less

        for(let i = 0; i < maxArrLength; i++) {  // requirements: to display 20 meal max
            mealsList.push(new MealWithAll(meals[i].idMeal, meals[i].strMeal, meals[i].strMealThumb));
        }

        return mealsList;
        } catch (error) {
            console.error(error);
        }
}

//show all meals from API in section
/**
 * 
 * @param {String} val - query value for each key type
 * @param {String} key - query key (c for categoryies || a for areas || i for ingredients)
 * @param {String} str - url endpoint (search || filter)
 * post params to the inner callback function => (getAllMeals())
 */
export async function displayAllMeals(val, key, str, flag = true) {
    try {
        if(flag) {
            showLoader();
        }
        const mealsList = await getAllMeals(val, key, str);
        let mealsContainer = '';

        for(let i = 0; i < mealsList.length; i++) {
            mealsContainer += `
                <div class="col-sm-6 col-md-4 col-lg-3 col-xl-2">
                    <a class="text-decoration-none" role="button" data-meal-id="${mealsList[i].id}">
                        <div class="card overflow-hidden rounded-3 position-relative">
                            <div><img class="w-100 img-fluid" src="${mealsList[i].thumbnail}" alt="${mealsList[i].title}"></div>
                            <div class="card-body bg-white bg-opacity-75 text-black d-flex align-items-center justify-content-center position-absolute w-100 h-100">
                                <h3>${mealsList[i].title}</h3>
                            </div>
                        </div>
                    </a>
                </div>
                `;
        }

        allMealsSection.innerHTML = mealsContainer;
    } catch (error) {
        console.error(error);
    }
}

//get all categories
export async function getAllCategories() {
    const url = `https://www.themealdb.com/api/json/v1/1/categories.php`;
    
    try {
        const response = await fetch(url);
        const result = await response.json()
        const categories = result.categories;

        categoriesList= [];
        for(let i = 0; i < categories.length; i++) {
            categoriesList.push(new Category(categories[i].idCategory, categories[i].strCategory, categories[i].strCategoryDescription, categories[i].strCategoryThumb));
        }
        return categoriesList;

        } catch (error) {
            console.error(error);
        }
}

//show all categories from API in section
export async function displayAllCategories() {
    try {
        showLoader();
        const categoriesList = await getAllCategories();
        let catContainer = '';

        for(let i = 0; i < categoriesList.length; i++) {
            catContainer += `
                <div class="col-6 col-md-4 col-lg-3 col-xl-2">
                        <a class="text-decoration-none" role="button" data-category=${categoriesList[i].title}>
                            <div class="card overflow-hidden rounded-3 position-relative">
                                <div><img class="w-100 img-fluid" src="${categoriesList[i].thumbnail}" alt="${categoriesList[i].title}"></div>
                                <div class="card-body bg-white bg-opacity-75 text-black text-center d-flex flex-column align-items-center justify-content-center position-absolute w-100 h-100">
                                    <h3>${categoriesList[i].title}</h3>
                                    <p>${categoriesList[i].short_description(50)}...</p>
                                </div>
                            </div>
                        </a>
                    </div>
                `;
        }

        categoriesSection.innerHTML = catContainer;
    } catch (error) {
        console.error(error);
    }
}

//get all areas
export async function getAllAreas() {
    const url = `https://www.themealdb.com/api/json/v1/1/list.php?a=list`;

    try {
        const response = await fetch(url);
        const result = await response.json()
        const areas = result.meals;

        areasList= [];
        for(let i = 0; i < areas.length; i++) {
            areasList.push(new Area(areas[i].strArea));
        }
        return areasList;

        } catch (error) {
            console.error(error);
        }
}

//show all areas from API in section
export async function displayAllAreas() {
    try {
        showLoader();
        const areasList = await getAllAreas();
        let areasContainer = '';

        for(let i = 0; i < areasList.length; i++) {
            areasContainer += `
                <div class="col-6 col-md-4 col-lg-3 col-xl-2">
                    <a class="text-decoration-none" role="button" data-area="${areasList[i].title}">
                        <div class="card text-center">
                            <i class="fa-solid fa-house-laptop fa-4x"></i>
                            <h3>${areasList[i].title}</h3>
                        </div>
                    </a>
                </div>
            `;
        }

        areasSection.innerHTML = areasContainer;
    } catch (error) {
        console.error(error);
    }
}

//get all ingredients
export async function getAllIngredients() {
    const url = `https://www.themealdb.com/api/json/v1/1/list.php?i=list`;
    
    try {
        const response = await fetch(url);
        const result = await response.json()
        const ingredients = result.meals;

        ingredientsList= [];
        for(let i = 0; i < ingredients.length; i++) {
            ingredientsList.push(new Ingredient(ingredients[i].idIngredient, ingredients[i].strIngredient, ingredients[i].strDescription, ingredients[i].strType));
        }
        return ingredientsList;

        } catch (error) {
            console.error(error);
        }
}

//show all areas from API in section
export async function displayAllIngredients() {
    try {
        showLoader();
        const ingredientsList = await getAllIngredients();
        let ingredientsContainer = '';

        for(let i = 0; i < ingredientsList.length; i++) {
            ingredientsContainer += `
                <div class="col-6 col-md-4 col-lg-3 col-xl-2">
                        <a class="text-decoration-none" role="button" data-ingredient="${ingredientsList[i].title}">
                            <div class="card text-center">
                                ${
                                    ingredientsList[i].getThumb() ? `<div><img class="w-100 img-fluid" src="${ingredientsList[i].getThumb()}" alt="${ingredientsList[i].title}"></div>` : `<i class="fa-solid fa-drumstick-bite fa-4x"></i>`
                                }
                                <h3>${ingredientsList[i].title}</h3>
                                <p>${ingredientsList[i].short_description(50)}</p>
                            </div>
                        </a>
                    </div>
            `;
        }

        ingredientsSection.innerHTML = ingredientsContainer;
    } catch (error) {
        console.error(error);
    }
}



//helper functions
export function show_hide(toShow_selector, ...arr) {
    toShow_selector.classList.remove('d-none');
    for(let i = 0; i < arr.length; i++) {
        arr[i].classList.add('d-none');
    }
}
export function showLoader() {
    show_hide(loadingSec, searchSec, categoriesSec, areasSec, ingredientsSec, contactSec, mealDetailsSec, homeSec);
}