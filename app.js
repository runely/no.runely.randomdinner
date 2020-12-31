'use strict';

const Homey = require('homey');

const createRandomDinner = require('./lib/create-random-dinner');

let tokens = [];

class MyApp extends Homey.App {
  /**
   * onInit is called when the app is initialized.
   */
  async onInit() {
    this.log(Homey.manifest.name.en + " v" + Homey.manifest.version + " is running...");

    // flow tokens
		new Homey.FlowToken("random_dinner", { type: "string", title: Homey.__('flowTokens.random_dinner') })
    .register()
    .then(token => tokens.push(token));

    // actions
		new Homey.FlowCardAction('create_random_dinner')
    .register()
    .registerRunListener(async (args, state) => {
      let ingredientCount = args.ingredient_count;
      let allowToiletWords = (args.allow_toilet_words === 'true' ? true : false);
      let allowIngredientMultipleTimes = (args.allow_ingredient_multiple_times === 'true' ? true : false);

      tokens[0].setValue(createRandomDinner(ingredientCount, allowToiletWords, allowIngredientMultipleTimes));

      return Promise.resolve(true);
    });
  }
}

module.exports = MyApp;