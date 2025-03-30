const searchbox = document.querySelector('.searchbox');
const searchBtn = document.querySelector('.searchBtn');
const recipeCcontainer = document.querySelector('.recipe-container');
const recipeDetailsContent = document.querySelector('.recipe-details-content');
const recipeCloseBtn = document.querySelector('.recipe-close-btn');

// Function to get recipes
const fetchRecipies = async (query) => {
    recipeCcontainer.innerHTML = "<h2>Fetching Recipes...</h2>"; 
    try {
        
    
    const data = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`);
    const response = await data.json();

    recipeCcontainer.innerHTML = ''; 
    response.meals.forEach(meal => {
        const recipeDiv = document.createElement('div');
        recipeDiv.classList.add('recipe');
        recipeDiv.innerHTML = `
            <img src="${meal.strMealThumb}" >
            <h3>${meal.strMeal}</h3>
            <p><span>${meal.strArea}</span> Dish</p>
            <p>Belongs to <span>${meal.strCategory}</span> Category</p>
        `;

        const button = document.createElement('button');
        button.textContent = 'View Recipe';
        recipeDiv.appendChild(button);

        // Add event listener to button
        button.addEventListener('click', () => {
            openRecipePopup(meal);
        });

        recipeCcontainer.appendChild(recipeDiv);
    });
    } 
    catch (error) {
        recipeCcontainer.innerHTML = "<h2>Error in Fetching Recipes...</br>(Recipe not Found!)</h2>"; 
        
    }
};

const fetchIngredients = (meal) => {
    let ingredientslist = "";
    for (let i = 1; i <= 20; i++) {
        const ingredient = meal[`strIngredient${i}`];
        if(ingredient){
            const measure = meal[`strMeasure${i}`];
            ingredientslist += `<li>${ingredient} - ${measure}</li>`;
        }
        else{
            break;
        }
    }
    return ingredientslist;
}



const openRecipePopup = (meal) =>{
    recipeDetailsContent.innerHTML = `
        <h2 class = "recipeName">${meal.strMeal}</h2>
        <h3>Ingredents</h3>
        <ul class = "ingredientList" >${fetchIngredients(meal)}</ul>
        <div class="recipeInstructions"> 
        <h3>Instructions : </h3>
        <p>${meal.strInstructions}</p>
        </div>
    `
    recipeDetailsContent.parentElement.style.display="block";
}

recipeCloseBtn.addEventListener('click', () => {
    recipeDetailsContent.parentElement.style.display="none";
});

searchBtn.addEventListener('click', (e) => {
    e.preventDefault();
    const searchInput = searchbox.value.trim();
    if(!searchInput){
        recipeCcontainer.innerHTML = "<h2>Error! </br> Please type the meal in the search.</h2>"; 
        return;
    }
    fetchRecipies(searchInput);
});
