'use strict'

const Homey = require('homey')

const createRandomDinner = require('./lib/create-random-dinner')

const tokens = []

class MyApp extends Homey.App {
  /**
   * onInit is called when the app is initialized.
   */
  async onInit () {
    this.log(Homey.manifest.name.en + ' v' + Homey.manifest.version + ' is running...')

    // Flow tokens
    tokens.push(await this.homey.flow.createToken('random_dinner', { type: 'string', title: this.homey.__('flowTokens.random_dinner') }))

    // Actions
    this.homey.flow.getActionCard('create_random_dinner')
      .registerRunListener(async (args, state) => {
        const ingredientCount = args.ingredient_count
        const allowToiletWords = (args.allow_toilet_words === 'true')
        const allowIngredientMultipleTimes = (args.allow_ingredient_multiple_times === 'true')

        if (Array.isArray(tokens) && tokens.length === 1) {
          await tokens[0].setValue(dinner)
        }

        return true
      })
  }
}

module.exports = MyApp
