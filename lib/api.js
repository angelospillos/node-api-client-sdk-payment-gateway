"use strict";

var client = require('./client');
var configuration = require('./configuration');

var token_cache = {};

var configure = exports.configure = function configure(options) {
  configuration.default_options = options;
  if (configuration.default_options === undefined && typeof configuration.default_options !== 'object') {
    throw new Error('Configuration options must be provided');
  }
  if (!configuration.default_options.grant_type) {
    throw new Error('Grant Type must be provided');
  }
  if (!configuration.default_options.client_id) {
    throw new Error('Client Id must be provided');
  }
  if (!configuration.default_options.client_secret) {
    throw new Error('Client Secret must be provided');
  }
  if (!configuration.default_options.grant_type === 'password') {
    if (!configuration.default_options.username) {
      throw new Error('Username must be provided');
    }
    if (!configuration.default_options.password) {
      throw new Error('Password must be provided');
    }
  }
};

var generateToken = exports.generateToken = function generateToken(config, callback) {

  if (typeof config === "function") {
    callback = config;
    config = configuration.default_options;
  } else if (!config) {
    config = configuration.default_options;
  }

  var payload = 'grant_type=client_credentials';
  if (config.grant_type === 'password') {
    var payload = 'grant_type=password&username=' + configuration.default_options.username
      + '&password=' + configuration.default_options.password
      + '&client_id=' + configuration.default_options.client_id
      + '&client_secret=' + configuration.default_options.client_secret;
  }

  if (config.authorization_code) {
    payload = 'grant_type=authorization_code&response_type=token&redirect_uri=' + configuration.default_options.redirect_uri + '&code=' + config.authorization_code;
  } else if (config.refresh_token) {
    payload = 'grant_type=refresh_token&refresh_token=' + config.refresh_token;
  }

  var authorizationHeader = 'Basic ' + new Buffer(config.client_id + ':' + config.client_secret).toString('base64');
  configuration.default_headers['Authorization'] = authorizationHeader;

  var http_options = {
    schema: configuration.default_options.schema,
    host: configuration.default_options.host,
    port: configuration.default_options.port,
    headers: configuration.default_headers
  };

  client.handle('POST', '/v1/authenticate/oauth/token', payload, http_options, function (err, res) {
    var token = null;
    if (res) {
      if (!config.authorization_code && !config.refresh_token) {
        var seconds = new Date().getTime() / 1000;
        token_cache[config.client_id] = res;
        token_cache[config.client_id].access_token = res.authToken;
        token_cache[config.client_id].created_at = seconds;
      }

      if (!config.authorization_code) {
        if (res.token_type) {
          token = res.token_type + ' ' + res.access_token;
        } else {
          token = 'Bearer ' + res.authToken;
        }
      }
      else {
        token = res.refresh_token;
      }
    }
    callback(err, token);
  });
};

function checkExpiredToken(token_hash) {
  var delta = (new Date().getTime() / 1000) - token_hash.created_at;
  return (delta < token_hash.expires_in) ? false : true;
};

function updateToken(http_options, error_callback, callback) {
  generateToken(http_options, function (error, token) {
    if (error) {
      error_callback(error, token);
    } else {
      http_options.headers.Authorization = token;
      callback();
    }
  });
}

var executeHttp = exports.executeHttp = function executeHttp(http_method, path, data, http_options, callback) {
  if (typeof http_options === "function") {
    callback = http_options;
    http_options = null;
  }
  if (!http_options) {
    http_options = configuration.default_options;
    http_options.headers = configuration.default_headers;
  }

  function retry() {
    client.handle(http_method, path, data, http_options, callback);
  }

  if (http_options.client_id in token_cache && checkExpiredToken(token_cache[http_options.client_id]) && !http_options.refresh_token) {
    http_options.headers.Authorization = "Bearer " + token_cache[http_options.client_id].access_token;
    client.handle(http_method, path, data, http_options, function (error, response) {
      if (error && error.httpStatusCode === 401 && http_options.client_id && http_options.headers.Authorization) {
        http_options.headers.Authorization = null;
        updateToken(http_options, callback, retry);
      } else {
        callback(error, response);
      }
    });
  } else {
    updateToken(http_options, callback, retry);
  }
};