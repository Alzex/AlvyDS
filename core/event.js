'use strict';

class EventHandler {
  /**
   * Event handler for emitted one by Discord API
   * @param {String} name Name of the emitted event
   * @param {Promise<void>} execute Callback for the emitted event
   */
  constructor(name, execute) {
    this.name = name;
    this.execute = execute;
  }
}

module.exports = EventHandler;
