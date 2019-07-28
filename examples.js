"use strict";

// Configure Payment Service SDK
var payment_service = require('./index');
var options = {
  'schema': 'http',
  'host': 'localhost',
  'port': '8080',
  'grant_type': 'password',
  'client_id': 'clientid',
  'client_secret': 'clientsecret',
  'username': 'pillos',
  'password': 'password'
};
payment_service.configure(options);

// Get Payment
var get_payment_id = "0c77e7b6-072e-4861-950a-772c69512648";
payment_service.payment.get(get_payment_id, function (error, payment) {
  if (error) {
    error.response ? console.log(error.response) : console.log(error);
  } else {
    console.log("Payment Information");
    console.log(JSON.stringify(payment));
  }
});

// List Payments
payment_service.payment.list(function (error, payments) {
  if (error) {
    error.response ? console.log(error.response) : console.log(error);
  } else {
    console.log("List of Payments");
    console.log(JSON.stringify(payments));
  }
});

// Approve Payment
var approve_payment_id = '0c77e7b6-072e-4861-950a-772c69512648';
payment_service.payment.approve(approve_payment_id, function (error, payment) {
  if (error) {
    error.response ? console.log(error.response) : console.log(error);
  } else {
    console.log("Approved Payment with id: " + approve_payment_id);
    console.log(JSON.stringify(payment));
  }
});

// Cancel Payment
var cancel_payment_id = 'b90c73cf-177a-48d6-abcd-9df1b9ad262d';
payment_service.payment.cancel(cancel_payment_id, function (error, payment) {
  if (error) {
    error.response ? console.log(error.response) : console.log(error);
  } else {
    console.log("Canceled Payment with id: " + cancel_payment_id);
    console.log(JSON.stringify(payment));
  }
});

// Create Payment
var create_payment = {
  "payeeId": "fc1941f3-7912-4b3d-8fdb-dcb9733aa994",
  "payerId": "0499274e-9325-43b1-9cff-57c957e9a337",
  "paymentSystem": "ingenico",
  "paymentMethod": "mastercard",
  "amount": 100500.42,
  "currency": "USD",
  "comment": "Salary for March"
};
payment_service.payment.create(create_payment, function (error, payment) {
  if (error) {
    throw error;
  } else {
    console.log("Create Payment Response with id: " + payment.id);
    console.log(payment);
  }
});