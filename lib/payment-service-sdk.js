"use strict";

var configuration = require('./configuration');
var api = require('./api');

module.exports = function () {

  function configure(options) {
    api.configure(options);
  }

  return {
    configure: configure,
    payment: require('./operations/Payment')(),
  };
};