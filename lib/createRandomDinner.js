const ingredients = require('./ingredients.json');

const getRandom = (array) => {
    let rand = Math.floor((Math.random() * array.length));
    return rand;
}

module.exports = () => {
    let randomFood = [
        ingredients.food[getRandom(ingredients.food)],
        ingredients.food[getRandom(ingredients.food)]
    ]
    let randomCookingMethod = ingredients.cookingMethod[getRandom(ingredients.cookingMethod)];
    let randomCookedFood = ingredients.food[getRandom(ingredients.food)];

    let dinner = '';
    randomFood.map(food => {
        if (dinner === '') {
            dinner += food;
        }
        else {
            dinner += ` med ${food}`;
        }
    });

    dinner += ` ved siden av ${randomCookingMethod} ${randomCookedFood}`;

    return dinner;
}