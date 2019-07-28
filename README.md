# node-api-client-sdk-payment-gateway
Payment Gateway Node js API Client SDK Wrapper Example

## Description
The purpose of this template is to kick-start your node js payment gateway sdk. 
It implements best practices in developing SDKs. 

Features include:
- API versioning handling from a client respective.
- A basic example of a OAuth2 Client Login
- Use of the Hexagonal Architecture to arrange the application into logical layers, with well-defined responsibilities.
- Persistence is implemented using an in-memory repository layer. This can be substituted with any persistence technology of your choice.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

### Prerequisites

What things you need to install the software and how to install them

- [Visual Studio Code](https://code.visualstudio.com/)
- [Node.js](https://nodejs.org/en/download/)
- [Payment Gateway](https://github.com/angelospillos/node-api-oauth-server-payment-gateway)

### Setup

To use the library you need to first 
- Clone the respective Payment Gateway server from https://github.com/angelospillos/node-api-oauth-server-payment-gateway
- Start it using by simply running `npm install` and `npm start`.
- Then you can use this library to interact with it.

## Usage (examples.js)
There is already an examples.js file so you can start using it right away assuming the API is started on port 8080;

### Configure Payment Service SDK
```
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
```

### Get Payment
```
var get_payment_id = "0c77e7b6-072e-4861-950a-772c69512648";
payment_service.payment.get(get_payment_id, function (error, payment) {
  if (error) {
    error.response ? console.log(error.response) : console.log(error);
  } else {
    console.log("Payment Information");
    console.log(JSON.stringify(payment));
  }
});
```

### List Payments
```
payment_service.payment.list(function (error, payments) {
  if (error) {
    error.response ? console.log(error.response) : console.log(error);
  } else {
    console.log("List of Payments");
    console.log(JSON.stringify(payments));
  }
});
```

### Approve Payment
```
var approve_payment_id = '0c77e7b6-072e-4861-950a-772c69512648';
payment_service.payment.approve(approve_payment_id, function (error, payment) {
  if (error) {
    error.response ? console.log(error.response) : console.log(error);
  } else {
    console.log("Approved Payment with id: " + approve_payment_id);
    console.log(JSON.stringify(payment));
  }
});
```

###  Cancel Payment
```
var cancel_payment_id = 'b90c73cf-177a-48d6-abcd-9df1b9ad262d';
payment_service.payment.cancel(cancel_payment_id, function (error, payment) {
  if (error) {
    error.response ? console.log(error.response) : console.log(error);
  } else {
    console.log("Canceled Payment with id: " + cancel_payment_id);
    console.log(JSON.stringify(payment));
  }
});
```

###  Create Payment
```
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
```

## HTTP Status codes
Each response contains aproper HTTP codeset. Here are the details:
- 200 — Success
- 201 — Created
- 400 — Client error (e.g. validation)
- 401 — Unathorized
- 500 — Server error

## Errors

### Structure
In caseof an error (both client 4xx and server 5xx), response will contain an object with the following structure:
```
{
   "code":"string",
   "message":"string"
}
```

### Unauthorized Error
```
{
   "code":"ERR_UNATHORIZED",
   "message":"No auth token provided"
}
```
### Auth Token Expired Error
```
{
   "code":"ERR_AUTH_TOKEN_EXPIRED",
   "message":"Auth token expired"
}
```

### Validation Error
```
{
   "code":"ERR_VALIDATION",
   "message":"Validation failed",
}
```

### Cannot Approve Error
```
{
   "code":"ERR_CANNOT_APPROVE",
   "message":"Cannot approve a payment that has already been cancelled"
}
```

### Cannot Cancel Error
```
{
   "code":"ERR_CANNOT_CANCEL",
   "message":"Cannot cancel a payment that has already been approved"
}
```

### Route Not Found Error
```
{
   "code":"ERR_ROUTE_NOT_FOUND",
   "message":"Route X Not Found"
}
```

## Architecture

```
/lib
    /operations
    /api
    /client
```

The source folder contains sub-folders that arrange the application into logical
layers as suggested by the
[Hexagonal Architecture](http://alistair.cockburn.us/Hexagonal+architecture)
(a.k.a. the
[Onion Architecture](http://jeffreypalermo.com/blog/the-onion-architecture-part-1/)):

-   `operations` An API support different operations such us, payments, refunds, reversals etc.
The operations folder contains the different CRUD operations that are supported per type of CRUD.

-   `client:` It adapts the HTTP transforms the HTTP requests from the external world 
to the service layer and transforms the objects returned by the service layer to HTTP
responses.

-   `api`: The api coordinates high-level activities such as authentication
and performing tasks defined in the operations. 

## Versioning

For the versions available, see the [tags on this repository](https://github.com/angelospillos/gateway/tags). 

## Authors

* **Angelos Pillos** - (https://www.angelospillos.com)

See also the list of [contributors](https://github.com/angelospillos/node-api-oauth-server-payment-gateway/graphs/contributors) who participated in this project.

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details

## Acknowledgments

* FxPro https://www.fxpro.com
* Archfirst https://archfirst.org/
