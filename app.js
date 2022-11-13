'use strict'

const Homey = require('homey')

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
    tokens.push(await this.homey.flow.createToken('random_dinner', { type: 'string', title: this.homey.__('flowTokens.random_dinner') }))

    // Actions
    this.homey.flow.getActionCard('create_random_dinner')
      .registerRunListener(async (args, state) => {
        const ingredientCount = args.ingredient_count
        const allowToiletWords = (args.allow_toilet_words === 'true')
        const includePredefinedFood = (args.include_predefined_food === 'true')
        const includePredefinedNonsense = (args.include_predefined_nonsense === 'true')
        const includePredefinedToiletWords = (args.include_predefined_toilet_words === 'true' && allowToiletWords)
        const includeOwnFood = (args.include_own_food === 'true')
        const includeOwnNonsene = (args.include_own_nonsense === 'true')
        const includeOwnToiletWords = (args.include_own_toilet_words === 'true' && allowToiletWords)
        const allowIngredientMultipleTimes = (args.allow_ingredient_multiple_times === 'true')

        const ownFood = includeOwnFood ? lowerAll(removeEmpty(this.homey.settings.get('ownFood'))) : []
        const ownNonsense = includeOwnNonsene ? lowerAll(removeEmpty(this.homey.settings.get('ownNonsense'))) : []
        const ownToiletWords = includeOwnToiletWords ? lowerAll(removeEmpty(this.homey.settings.get('ownToiletWords'))) : []

        if (Array.isArray(tokens) && tokens.length === 1) {
          const dinner = createRandomDinner(this.homey, ingredientCount, includePredefinedFood, includePredefinedNonsense, includePredefinedToiletWords, ownFood, ownNonsense, ownToiletWords, allowIngredientMultipleTimes)
          await tokens[0].setValue(dinner)
        }

        return true
      })
  }
}

module.exports = MyApp
