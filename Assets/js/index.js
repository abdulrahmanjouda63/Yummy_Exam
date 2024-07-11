import { displayMealDetails, displayAllMeals, displayAllCategories, displayAllAreas, displayAllIngredients, show_hide } from "./ui.js";
import { validCheck_All_byIndex } from './validation.js';

// Select elements from HTML
//Aside Section
const logo = document.querySelector('header .logo');
const asideHeader = document.querySelector('header>div');
const asideTrigger = document.querySelector('#trigger');
const triggerBars = document.querySelector('#trigger>button:has(.fa-bars)');
const triggerClose = document.querySelector('#trigger>button:has(.fa-close)');
//Main Section
const searchByName_input = document.querySelector('#search-by-name');
const searchByFirstLetter_input = document.querySelector('#search-by-fLetter');
const homeSection = document.querySelector('#home .body-to-fill');
const searchSection = document.querySelector('#search');
const categoriesSection = document.querySelector('#categories');
const areasSection = document.querySelector('#areas');
const ingredientsSection = document.querySelector('#ingredients');
const contactSection = document.querySelector('#contact');
const mealDetailsSection = document.querySelector('#mealDetails');
const loadingSection = document.querySelector('#loading');
//Nav-links
const nav_links = document.querySelectorAll('nav .nav-link');
const search_link = document.querySelector('nav [data-value="search"]');
const categories_link = document.querySelector('nav [data-value="categories"]');
const areas_link = document.querySelector('nav [data-value="areas"]');
const ingredients_link = document.querySelector('nav [data-value="ingredients"]');
const contact_link = document.querySelector('nav [data-value="contact"]');
//Contact section
const signup_inputs = document.querySelectorAll('#contact .form-control');
const submit_input = document.querySelector('#contact #submit');

// Initialize global variables
var searchValue;
//Cards
var mealCards;
var categoryCards;
var areaCards;
var ingredientCards;
//localstorage
// var curr_category = localStorage.getItem('curr_category');


// On page loading, Loading meals cards for "" on search api
(async function() {
    await displayAllMeals_displayMealDetails();
})();

// Reload page onclick on logo img
logo.addEventListener('click', () => {
    location.reload();
});

// Navbar links
search_link.addEventListener('click', async() => {
    show_hide(searchSection, categoriesSection, areasSection, ingredientsSection, contactSection, mealDetailsSection, loadingSection);

    // Get searchInput results from user
    searchByName_input.addEventListener('input', async(e) => {
        searchValue = e.target.value;
        await displayAllMeals_displayMealDetails(searchValue, 's', 'search', false);
        show_hide(searchSection);
    });
    searchByFirstLetter_input.addEventListener('input', async(e) => {
        searchValue = e.target.value;
        await displayAllMeals_displayMealDetails(searchValue, 'f', 'search', false);
        show_hide(searchSection);
    });
})
categories_link.addEventListener('click', async() => {
    await displayAllCategories();
    show_hide(categoriesSection, searchSection, homeSection, areasSection, ingredientsSection, contactSection, mealDetailsSection, loadingSection);

    categoryCards = document.querySelectorAll('#categories .body-to-fill>div>a');
    categoryCards.forEach(async(ele) => {
        ele.addEventListener('click', async() => {
            let cat = ele.getAttribute('data-category');
            await displayAllMeals_displayMealDetails(cat, 'c', 'filter');
        })
    });
})
areas_link.addEventListener('click', async() => {
    await displayAllAreas();
    show_hide(areasSection, categoriesSection, searchSection, homeSection, ingredientsSection, contactSection, mealDetailsSection, loadingSection);
    
    areaCards = document.querySelectorAll('#areas .body-to-fill>div>a');
    areaCards.forEach((ele) => {
        ele.addEventListener('click', async() => {
            let area = ele.getAttribute('data-area');
            await displayAllMeals_displayMealDetails(area, 'a', 'filter');
        })
    });
})
ingredients_link.addEventListener('click', async() => {
    await displayAllIngredients();
    show_hide(ingredientsSection, areasSection, categoriesSection, searchSection, homeSection, contactSection, mealDetailsSection, loadingSection);

    ingredientCards = document.querySelectorAll('#ingredients .body-to-fill>div>a');
    ingredientCards.forEach((ele) => {
        ele.addEventListener('click', async() => {
            let ingredient = ele.getAttribute('data-ingredient');
            await displayAllMeals_displayMealDetails(ingredient, 'i', 'filter');
            showHome();
        })
    });
})
contact_link.addEventListener('click', async() => {
    let valid_flags = new Array(6).fill(0);
    show_hide(contactSection, areasSection, categoriesSection, searchSection, homeSection, ingredientsSection, mealDetailsSection, loadingSection);

    signup_inputs.forEach((ele, index) => {
        ele.addEventListener('input', () => {
            // store validation function output in localstorage
            valid_flags = validCheck_All_byIndex(ele, index, ele.getAttribute('name'));
            localStorage.setItem('valid_flags', JSON.stringify(valid_flags));

            // Check validation and update submit button state
            const isAllValid = valid_flags.every(flag => flag === 1);
            submit_input.disabled = !isAllValid; // Use disabled property directly

            // Consider loading valid_flags from localStorage on initial load
            const storedFlags = JSON.parse(localStorage.getItem('valid_flags'));
            if (storedFlags && storedFlags.length === valid_flags.length) {
                valid_flags = storedFlags; // Restore flags from localStorage (optional)
                submit_input.disabled = !valid_flags.every(flag => flag === 1); // Set initial submit button state
            }
        })
    })
})



//UI effects
//Animate aside section (show and hide)
asideTrigger.addEventListener('click', () => {
    if(!triggerBars.classList.contains('d-none')) {
        triggerBars.classList.add('d-none');
        triggerClose.classList.replace('d-none', 'd-block');
        asideHeader.classList.add('left-from-offcanvas');
    } else {
        triggerBars.classList.remove('d-none');
        triggerClose.classList.replace('d-block', 'd-none');
        asideHeader.classList.remove('left-from-offcanvas');
    }
})
nav_links.forEach((ele) => {
    ele.addEventListener('click', () => {
        triggerBars.classList.remove('d-none');
        triggerClose.classList.replace('d-block', 'd-none');
        asideHeader.classList.remove('left-from-offcanvas');
    })
})

//shared functions
function showHome() {
    show_hide(homeSection, searchSection, categoriesSection, areasSection, ingredientsSection, contactSection, mealDetailsSection, loadingSection);
}
/**
 * 
 * @param {String} val - query value for each key type
 * @param {String} key - query key (c for categoryies || a for areas || i for ingredients)
 * @param {String} str - url endpoint (search || filter)
 */
async function displayAllMeals_displayMealDetails(val, key, str, flag) {
    await displayAllMeals(val, key, str, flag); //display home section
    showHome();

    mealCards = document.querySelectorAll('#home .body-to-fill>div>a');
    mealCards.forEach((ele) => {
        ele.addEventListener('click', async() => {
            let id = ele.getAttribute('data-meal-id');
            displayMealDetails(id); //display mealDetails section
        })
    });
}