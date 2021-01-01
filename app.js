'use strict';

const Homey = require('homey');

const createRandomDinner = require('./lib/create-random-dinner');

const tokens = [];

class MyApp extends Homey.App {
  /**
   * onInit is called when the app is initialized.
   */
  async onInit() {
    this.log(Homey.manifest.name.en + ' v' + Homey.manifest.version + ' is running...');

    // Flow tokens
    new Homey.FlowToken('random_dinner', { type: 'string', title: Homey.__('flowTokens.random_dinner') })
      .register()
      .then(token => tokens.push(token));

    // Actions
    new Homey.FlowCardAction('create_random_dinner')
      .register()
      .registerRunListener(async (args, state) => {
        const ingredientCount = args.ingredient_count;
        const allowToiletWords = (args.allow_toilet_words === 'true');
        const allowIngredientMultipleTimes = (args.allow_ingredient_multiple_times === 'true');

        tokens[0].setValue(createRandomDinner(ingredientCount, allowToiletWords, allowIngredientMultipleTimes));

        return Promise.resolve(true);
      });
  }
}

module.exports = MyApp;