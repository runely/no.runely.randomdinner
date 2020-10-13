const Homey = require('homey');

const ingredients = require('./ingredients.json');

let usedFood = [];

const getRandom = (array) => {
    return Math.floor((Math.random() * array.length));
}

const getRandomFood = (ingredientCount, allowToiletWords, allowIngredientMultipleTimes) => {
    let foods = [];
    for (let i = 0; i < ingredientCount; i++) {
        let pickedFood;
        do {
            if (allowToiletWords) {
                pickedFood = ingredients.food[getRandom(ingredients.food)];
            }
            else {
                pickedFood = ingredients.decentFood[getRandom(ingredients.decentFood)];
            }
        } while (usedFood.some(food => food === pickedFood));

        if (!allowIngredientMultipleTimes) {
            usedFood.push(pickedFood);
        }
        foods.push(pickedFood);
    }

    return foods;
}

module.exports = (ingredientCount, allowToiletWords, allowIngredientMultipleTimes) => {
    // reset used food
    usedFood = [];

    let randomFood = getRandomFood(ingredientCount, allowToiletWords, allowIngredientMultipleTimes);
    let randomCookingMethod = ingredients.cookingMethod[getRandom(ingredients.cookingMethod)];
    let randomCookedFood = getRandomFood(1, allowToiletWords, allowIngredientMultipleTimes);

    let dinner = '';
    randomFood.map(food => {
        if (dinner === '') {
            dinner += food;
        }
        else {
            dinner += ` ${Homey.__('dinner.dinner_split')} ${food}`;
        }
    });

    dinner += ` ${Homey.__('dinner.dinner_cooking_split')} ${randomCookingMethod} ${randomCookedFood}`;

    return dinner;
}