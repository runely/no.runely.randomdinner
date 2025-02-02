'use strict'

const Homey = require('homey')

const { getTranslation } = require('./lib/ingredients')
const createRandomDinner = require('./lib/create-random-dinner')

const tokens = []

const removeEmpty = arr => {
  if (!Array.isArray(arr) || arr.length === 0) return []

  const newArr = []
  arr.forEach(item => {
    if (item) {
      newArr.push(item)
    }
  })

  return newArr
}

const lowerAll = arr => arr.map(item => item.toLowerCase())

class MyApp extends Homey.App {
  /**
   * onInit is called when the app is initialized.
   */
  async onInit () {
    this.log(Homey.manifest.name.en + ' v' + Homey.manifest.version + ' is running...')

    const language = this.homey.i18n.getLanguage()
    const foods = getTranslation('food', language)
    const usedLanguage = foods.language

    this.homey.settings.set('predefinedFood', foods.values)
    this.homey.settings.set('predefinedNonsense', getTranslation('nonsense', language).values)
    this.homey.settings.set('predefinedToiletWords', getTranslation('toiletwords', language).values)
    this.homey.settings.set('predefinedCookingMethods', getTranslation('cookingmethod', language).values)

    if (!this.homey.settings.get('ownFood')) {
      this.homey.settings.set('ownFood', '')
    }

    if (!this.homey.settings.get('ownNonsense')) {
      this.homey.settings.set('ownNonsense', '')
    }

    if (!this.homey.settings.get('ownToiletWords')) {
      this.homey.settings.set('ownToiletWords', '')
    }

    // Flow tokens
    tokens.push(await this.homey.flow.createToken('random_dinner',
      { type: 'string', title: this.homey.__('flowTokens.random_dinner'), value: null }))

    // Actions
    this.homey.flow.getActionCard('create_random_dinner')
      .registerRunListener(async (args, _) => {
        const ingredientCount = args.ingredient_count
        const allowToiletWords = args.allow_toilet_words

        const includePredefinedFood = args.include_predefined_food
        const includePredefinedNonsense = args.include_predefined_nonsense
        const includePredefinedToiletWords = args.include_predefined_toilet_words && allowToiletWords

        const includeOwnFood = args.include_own_food
        const includeOwnNonsense = args.include_own_nonsense
        const includeOwnToiletWords = args.include_own_toilet_words && allowToiletWords

        const allowIngredientMultipleTimes = args.allow_ingredient_multiple_times

        const ownFood = includeOwnFood ? lowerAll(removeEmpty(this.homey.settings.get('ownFood'))) : []
        const ownNonsense = includeOwnNonsense ? lowerAll(removeEmpty(this.homey.settings.get('ownNonsense'))) : []
        const ownToiletWords = includeOwnToiletWords ? lowerAll(removeEmpty(this.homey.settings.get('ownToiletWords'))) : []

        if (!Array.isArray(tokens) || tokens.length !== 1) {
          this.error('[ERROR] - Creating random dinner failed. Token not found!')
          return false
        }

        const dinner = createRandomDinner(
          this.homey,
          ingredientCount,
          includePredefinedFood,
          includePredefinedNonsense,
          includePredefinedToiletWords,
          ownFood,
          ownNonsense,
          ownToiletWords,
          allowIngredientMultipleTimes,
          language)
        await tokens[0].setValue(dinner)

        this.log(`Created random dinner in '${language}' (used '${usedLanguage}') of ${ingredientCount} ingredients:`, dinner)

        return true
      })
  }
}

module.exports = MyApp
