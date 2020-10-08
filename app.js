'use strict';

const Homey = require('homey');

const createRandomDinner = require('./lib/createRandomDinner');

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
      tokens[0].setValue(createRandomDinner());

      return Promise.resolve(true);
    });
  }
}

module.exports = MyApp;