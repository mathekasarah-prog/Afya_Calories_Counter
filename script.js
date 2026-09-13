const foodForm = document.querySelector("#food-form");
const foodNameInput = document.querySelector("#food-name");
const caloriesInput = document.querySelector("#calories");
const foodList = document.querySelector("#food-list");
const totalCalories = document.querySelector("#total-calories");
const resetButton = document.querySelector("#reset-btn");
const lookupButton = document.querySelector("#lookup-btn");
const lookupMessage = document.querySelector("#lookup-message");


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

foodForm.addEventListener("submit", function(event) {
    event.preventDefault();

    const foodName = foodNameInput.value.trim();
    const calories = Number(caloriesInput.value);

    if (foodName === "") {
        alert("Please enter a food name.");
        return;
    }

    if (calories <= 0) {
        alert("Please enter a valid calorie amount.");
        return;
    }

    addFood(foodName, calories);

    foodForm.reset();
    lookupMessage.textContent = "";
});
    

function displayFoods() {
    foodList.innerHTML = "";

    if (foods.length === 0) {
        const emptyMessage = document.createElement("li");

        emptyMessage.textContent =
            "No foods added yet. Start by adding your first meal.";

        emptyMessage.className =
            "text-center text-gray-500 py-6";

        foodList.appendChild(emptyMessage);

        return;
    }

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

lookupButton.addEventListener("click", async function() {
    const foodName = foodNameInput.value.trim();

    if (foodName === "") {
        lookupMessage.textContent = "Please enter a food name first.";
        return;
    }

    const food = await fetchFoodData(foodName);

    if (food) {
        caloriesInput.value = food.calories;
        lookupMessage.textContent =
            `${food.name} contains approximately ${food.calories} kcal.`;
    } else {
        lookupMessage.textContent =
            "Food not found. Please enter the calories manually.";
    }
});

