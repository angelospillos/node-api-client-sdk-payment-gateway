var request = require('request');

var handle = exports.handle = function handle(http_method, path, data, http_options_parameters, callback) {

  var schema = (http_options_parameters.schema === 'http') ? 'http://' : 'https://';
  var request_data = data;

  if (http_method === 'GET') {
    if (typeof request_data !== 'string') {
      request_data = JSON.stringify(request_data);
    }
    if (request_data) {
      path = path + "?" + request_data;
      request_data = "";
    }
  } else if (typeof request_data !== 'string') {
    request_data = JSON.stringify(request_data);
  }

  var http_options = {};
  if (http_options_parameters) {
    http_options = JSON.parse(JSON.stringify(http_options_parameters));
    if (!http_options.headers) {
      http_options.headers = {};
    }
    http_options.path = path;
    http_options.method = http_method;
    if (!http_options.headers.Accept) {
      http_options.headers.Accept = 'application/json';
    }
    if (!http_options.headers['Content-Type']) {
      http_options.headers['Content-Type'] = 'application/json';
    }
  }

  var options = {
    method: http_method,
    url: schema + http_options.host + ':' + http_options.port + http_options.path,
    body: request_data,
    headers: http_options.headers
  };

  request(options, function (error, res, response) {
    try {
      if (response.trim() === '') {
        response = JSON.parse('{}');
      } else {
        response = JSON.parse(response);
      }
      response.httpStatusCode = res.statusCode;
    } catch (e) {
      error = new Error('Invalid Response');
      error.error = {
        name: 'JSON Parse Error'
      };
      error.response = response;
      if (!res) {
        error.httpStatusCode = 500;
      } else {
        error.httpStatusCode = res.statusCode;
      }
      response = null;
    }
    if (!error && (res.statusCode < 200 || res.statusCode >= 300)) {
      error = new Error('Response Status : ' + res.statusCode);
      error.response = response;
      error.httpStatusCode = res.statusCode;
      response = null;
    }
    callback(error, response);
  });

};