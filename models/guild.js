'use strict';

const mongoose = require('mongoose');
const { Schema } = require('mongoose');

const guild = new Schema({
  _id: Number,
  roles: [{
    _id: String,
    tier: Number
  }],
  users: [{
    _id: String,
    lastRole: Date
  }]
});

module.exports = mongoose.model('guild', guild);
