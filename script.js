const foodForm = document.querySelector("#food-form");
const foodNameInput = document.querySelector("#food-name");
const caloriesInput = document.querySelector("#calories");
const foodList = document.querySelector("#food-list");
const totalCalories = document.querySelector("#total-calories");
const resetButton = document.querySelector("#reset-btn");


let foods[];

function calculateTotalCalories() {
    let total = 0;

    foods.forEach(function(food) {
        total += food.calories;
    });
    totalCalories.textContent = total;
}
