"use strict";

var api = require('../api');

function payment() {
  var baseURL = '/v1/payments/';
  var restFunctions = {
    baseURL: baseURL,
    create: function create(data, config, callback) {
      api.executeHttp('POST', this.baseURL, data, config, callback);
    },
    get: function get(id, config, callback) {
      api.executeHttp('GET', this.baseURL + id, {}, config, callback);
    },
    list: function list(data, config, callback) {
      if (typeof data === 'function') {
        config = data;
        data = {};
      }
      api.executeHttp('GET', this.baseURL, data, config, callback);
    },
    approve: function approve(id, config, callback) {
      api.executeHttp('PUT', this.baseURL + id + '/approve', {}, config, callback);
    },
    cancel: function cancel(id, config, callback) {
      api.executeHttp('PUT', this.baseURL + id + '/cancel', {}, config, callback);
    },
  };
  return restFunctions;
}

module.exports = payment;