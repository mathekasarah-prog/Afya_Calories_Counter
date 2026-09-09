const foodForm = document.querySelector("#food-form");
const foodNameInput = document.querySelector("#food-name");
const caloriesInput = document.querySelector("#calories");
const foodList = document.querySelector("#food-list");
const totalCalories = document.querySelector("#total-calories");
const resetButton = document.querySelector("#reset-btn");


let foods = [];

function calculateTotalCalories() {
    let total = 0;

    foods.forEach(function(food) {
        total += food.calories;
    });

    totalCalories.textContent = total;
}

function addFood(foodName, calories) {
    const food = {
        name: foodName,
        calories: calories
    };
    foods.push(food);

    saveFoods();
    displayFoods();
    calculateTotalCalories();
}

foodForm.addEventListener("submit", async function(event) {
    event.preventDefault();

    const foodName = foodNameInput.value.trim();
    
    const food = await fetchFoodData(foodName);

    if (!food) {
        alert("Sorry, that food is not in our calorie database.");
        return;
    }

    addFood(food.name, food.calories);

    foodForm.reset();
});

function displayFoods() {
    foodList.innerHTML = "";

    foods.forEach(function(food, index) {
        const listItem = document.createElement("li");

        listItem.className =
            "flex items-center justify-between bg-gray-50 p-4 rounded-lg border";

            const foodInfo = document.createElement("span");

        foodInfo.textContent =
            `${food.name} - ${food.calories} kcal`;

        const removeButton = document.createElement("button");

        removeButton.textContent = "Remove";

        removeButton.className =
            "bg-red-500 text-white px-3 py-2 rounded-lg hover:bg-red-600 transition";

        removeButton.addEventListener("click", function() {
            removeFood(index);
        });

        listItem.appendChild(foodInfo);
        listItem.appendChild(removeButton);

        foodList.appendChild(listItem);
    });
}
function removeFood(index) {
    foods.splice(index, 1);

    saveFoods();
    displayFoods();
    calculateTotalCalories();
}


function resetCalories(){
    foods = [];

    localStorage.removeItem("foods");

    displayFoods();
    calculateTotalCalories();
}

resetButton.addEventListener("click", resetCalories);

function saveFoods() {
    localStorage.setItem("foods", JSON.stringify(foods));
}

function loadFoods() {
    const savedFoods = localStorage.getItem("foods");

    if (savedFoods) {
        foods = JSON.parse(savedFoods);
    }

    displayFoods();
    calculateTotalCalories();
}

loadFoods();


async function fetchFoodData(foodName) {
    try {
        const response = await fetch("foods.json");

        if (!response.ok) {
            throw new Error("Failed to fetch food data.");
        }

        const foodData = await response.json();

        const food = foodData.find(function(item) {
            return item.name.toLowerCase() === foodName.toLowerCase();
        });

        return food;

    } catch (error) {
        console.error("Error fetching food data:", error);
        return null;
    }
}