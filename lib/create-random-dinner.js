const { getTranslation } = require('./ingredients')

let usedFood = []

const getRandom = array => {
  return Math.floor((Math.random() * array.length))
}

const getRandomFood = (app, ingredientCount, ingredients, allowIngredientMultipleTimes = true) => {
  const foods = []
  if (ingredientCount > ingredients.length) {
    app.log(`Because requested ingredientCount is higher than available ingredients, ingredientCount will be set from ${ingredientCount} to ${ingredients.length}`)
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

const getIngredients = (app, includePredefinedFood, includePredefinedNonsense, includePredefinedToiletWords, ownFood, ownNonsene, ownToiletWords, language) => {
  const foods = []

  if (includePredefinedFood) {
    const includedDecentFood = getTranslation('food', language).values
    app.log(`Including ${includedDecentFood.length} predefined foods`)
    foods.push(...includedDecentFood)
  }

  if (includePredefinedNonsense) {
    const includedNonsense = getTranslation('nonsense', language).values
    app.log(`Including ${includedNonsense.length} predefined nonsense`)
    foods.push(...includedNonsense)
  }

  if (includePredefinedToiletWords) {
    const includedToiletWords = getTranslation('toiletwords', language).values
    app.log(`Including ${includedToiletWords.length} predefined toilet words`)
    foods.push(...includedToiletWords)
  }

  app.log(`Including ${ownFood.length} custom foods (if not already included)`)
  ownFood.forEach(own => {
    if (!foods.includes(own)) {
      foods.push(own)
    } else app.log(`Did not include own food '${own}' because it's already added`)
  })

  app.log(`Including ${ownNonsene.length} custom nonsense (if not already included)`)
  ownNonsene.forEach(own => {
    if (!foods.includes(own)) {
      foods.push(own)
    } else app.log(`Did not include own nonsense '${own}' because it's already added`)
  })

  app.log(`Including ${ownToiletWords.length} custom toilet words (if not already included)`)
  ownToiletWords.forEach(own => {
    if (!foods.includes(own)) {
      foods.push(own)
    } else app.log(`Did not include own toilet word '${own}' because it's already added`)
  })

  app.log(`Included ${foods.length} ingredients`)
  return foods
}

module.exports = (app, ingredientCount, includePredefinedFood, includePredefinedNonsense, includePredefinedToiletWords, ownFood, ownNonsene, ownToiletWords, allowIngredientMultipleTimes, language) => {
  // Reset used food
  usedFood = []

  const cookingMethods = getTranslation('cookingmethod', language).values

  const ingredients = getIngredients(app, includePredefinedFood, includePredefinedNonsense, includePredefinedToiletWords, ownFood, ownNonsene, ownToiletWords, language)
  app.log(`Using ${cookingMethods.length} cooking methods`)
  if (ingredients.length === 0) return ''

  const randomFood = getRandomFood(app, ingredientCount, ingredients, allowIngredientMultipleTimes)
  const randomCookingMethod = cookingMethods[getRandom(cookingMethods)]
  const randomCookedFood = getRandomFood(app, 1, ingredients)

  let dinner = ''
  randomFood.forEach(food => {
    dinner += dinner === '' ? `${food[0].toUpperCase()}${food.slice(1).toLowerCase()}` : ` ${app.__('dinner.dinner_split')} ${food.toLowerCase()}`
  })

  dinner += ` ${app.__('dinner.dinner_cooking_split')} ${randomCookingMethod} ${randomCookedFood.toLowerCase()}`

  return dinner
}
