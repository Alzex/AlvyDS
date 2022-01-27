'use strict';

const DiscordJS = require('discord.js');

/**
 * The main hub for interacting with
 * the Discord API, and the starting point for any bot.
 * @extends DiscordJS.Client
 */

class Client extends DiscordJS.Client {
  /**
* @param {ClientOptions} options Options for the client
*/
  constructor(options) {
    super(options);
    this.commands = new DiscordJS.Collection();
  }
}

module.exports = { Client };
