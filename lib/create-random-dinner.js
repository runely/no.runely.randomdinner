const { cookingMethod, includedDecentFood, includedNonsense, includedToiletWords } = require('./ingredients')

let usedFood = []

const getRandom = array => {
  return Math.floor((Math.random() * array.length))
}

const getRandomFood = (ingredientCount, ingredients, allowIngredientMultipleTimes = true) => {
  const foods = []
  if (ingredientCount > ingredients.length) {
    console.log(`Because requested ingredientCount is higher than available ingredients, ingredientCount will be set from ${ingredientCount} to ${ingredients.length}`)
    ingredientCount = ingredients.length
  }
  for (let i = 0; i < ingredientCount; i++) {
    let pickedFood
    if (allowIngredientMultipleTimes) {
      pickedFood = ingredients[getRandom(ingredients)]
    } else {
      do {
        pickedFood = ingredients[getRandom(ingredients)]
      } while (usedFood.some(food => food === pickedFood))

      usedFood.push(pickedFood)
    }

    foods.push(pickedFood)
  }

  return foods.length === 1 ? foods[0] : foods
}

const getIngredients = (includePredefinedFood, includePredefinedNonsense, includePredefinedToiletWords, ownFood, ownNonsene, ownToiletWords) => {
  const foods = []

  if (includePredefinedFood) {
    console.log(`Including ${includedDecentFood.length} predefined foods`)
    foods.push(...includedDecentFood)
  }

  if (includePredefinedNonsense) {
    console.log(`Including ${includedNonsense.length} predefined nonsense`)
    foods.push(...includedNonsense)
  }

  if (includePredefinedToiletWords) {
    console.log(`Including ${includedToiletWords.length} predefined toilet words`)
    foods.push(...includedToiletWords)
  }

  ownFood.forEach(own => {
    if (!foods.includes(own)) {
      foods.push(own)
    } else console.log(`Did not include own food '${own}' because it's already added`)
  })
  ownNonsene.forEach(own => {
    if (!foods.includes(own)) {
      foods.push(own)
    } else console.log(`Did not include own nonsense '${own}' because it's already added`)
  })
  ownToiletWords.forEach(own => {
    if (!foods.includes(own)) {
      foods.push(own)
    } else console.log(`Did not include own toilet word '${own}' because it's already added`)
  })

  console.log(`Included ${foods.length} ingredients`)
  return foods
}

module.exports = (app, ingredientCount, includePredefinedFood, includePredefinedNonsense, includePredefinedToiletWords, ownFood, ownNonsene, ownToiletWords, allowIngredientMultipleTimes) => {
  // Reset used food
  usedFood = []

  const ingredients = getIngredients(includePredefinedFood, includePredefinedNonsense, includePredefinedToiletWords, ownFood, ownNonsene, ownToiletWords)
  if (ingredients.length === 0) return ''

  const randomFood = getRandomFood(ingredientCount, ingredients, allowIngredientMultipleTimes)
  const randomCookingMethod = cookingMethod[getRandom(cookingMethod)]
  const randomCookedFood = getRandomFood(1, ingredients)

  let dinner = ''
  randomFood.forEach(food => {
    dinner += dinner === '' ? `${food[0].toUpperCase()}${food.slice(1).toLowerCase()}` : ` ${app.__('dinner.dinner_split')} ${food.toLowerCase()}`
  })

  dinner += ` ${app.__('dinner.dinner_cooking_split')} ${randomCookingMethod} ${randomCookedFood.toLowerCase()}`

  return dinner
}
