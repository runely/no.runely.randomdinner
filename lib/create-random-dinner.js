const Homey = require('homey');

const ingredients = require('./ingredients.json');

let usedFood = [];

const getRandom = array => {
  return Math.floor((Math.random() * array.length));
};

const getRandomFood = (ingredientCount, allowToiletWords, allowIngredientMultipleTimes) => {
  const foods = [];
  for (let i = 0; i < ingredientCount; i++) {
    let pickedFood;
    do {
      pickedFood = allowToiletWords ? ingredients.food[getRandom(ingredients.food)] : ingredients.decentFood[getRandom(ingredients.decentFood)];
    } while (usedFood.some(food => food === pickedFood));

    if (!allowIngredientMultipleTimes) {
      usedFood.push(pickedFood);
    }

    foods.push(pickedFood);
  }

  return foods;
};

module.exports = (ingredientCount, allowToiletWords, allowIngredientMultipleTimes) => {
  // Reset used food
  usedFood = [];

  const randomFood = getRandomFood(ingredientCount, allowToiletWords, allowIngredientMultipleTimes);
  const randomCookingMethod = ingredients.cookingMethod[getRandom(ingredients.cookingMethod)];
  const randomCookedFood = getRandomFood(1, allowToiletWords, allowIngredientMultipleTimes);

  let dinner = '';
  randomFood.forEach(food => {
    dinner += dinner === '' ? food : ` ${Homey.__('dinner.dinner_split')} ${food}`;
  });

  dinner += ` ${Homey.__('dinner.dinner_cooking_split')} ${randomCookingMethod} ${randomCookedFood}`;

  return dinner;
};
