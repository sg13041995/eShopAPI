# eShop_

This is an eCommerce RESTful API written in Nodejs. This API is designed to utilize the association of MongoDB Atlast as database. It has core features like signup, login for users and admins separately. It has order and product related routes with authentication and authorization implemented. For example, only Admin can create, update, delete products. Any client can view all the available products but only authorized or logged in users can place orders, view orders etc.

## Description

This is a basic eCommerce RESTful API project that includes standard features that can be implemented with web applications with required modifications if any. This project has been designed in Nodejs using different external packages for functionalities and express as the main framework. It uses MongoDB Atlas as the database service partner. It is a cloud-native document database as a service. The features and functionalities of this API are discussed below:

* Routes, endpoints, request type, their use and auth requirement:

| Base URL | Endpoint | Request | Use | Auth requirement |
| --- | --- | --- | --- | --- |
| /users | /users/signup | POST | To signup a new user | OPEN |
|  | /users/login | POST | To login a user who has already signed up or registered | OPEN |
|  | /users/:userId | DELETE | To delete an existing specific user by id | ADMIN |
| /admins | /admins/signup | POST | To signup a new admin | OPEN |
|  | /admins/login | POST | To login a admin who has already signed up or registered | OPEN |
|  | /admins/:userId | DELETE | To delete an existing specific admin by id | OPEN |
| /products | /products/ | GET | To get all the available products | OPEN |
| | /products/ | POST | To create a new product | ADMIN |
| | /products/:productId | GET | To get a specific product details by id | OPEN |
| | /products/:productId | PATCH | To update a specific product by id | ADMIN |
| | /products/:productId | DELETE | To delete a specific product by id | ADMIN |
| /orders | /orders/all | GET | To get the of all the orders from all the users | ADMIN |
| | /orders/ | GET | To get the order list for the logged in user | USER |
| | /orders/ | POST | To place a new order | USER |
| | /orders/:orderId | GET | To get a specific order details by id | ADMIN |
| | /orders/:orderId | DELETE | To delete a specific order by id by the logged in user | USER |

* The packages used in this project are as follows:

| Package name | How it has been used in the project |
| --- | --- |
| Mongoose | Mongoose library helps to create a connection between MongoDB and the Express web application framework. It provides a straight-forward, schema-based solution to model our application data. |
| Multer | Multer middleware has been used to handle the file uploads in my project. I have provided file filter to check file size and format as well. It helps to get the file and save it in aproper directory with proper format of filename. Multer adds a body object and file object to the request object. So, we can get the values of the text fields of the form through body object and the uploaded file from the file object. |
| Morgan | Morgan middleware has been used to get the request and response log. It is a http request logger middleware. |
| Bcrypt | Bcrypt library has been used to be able to hash and salt the password of admins and users during the their signup while saving the password to the database. The credential of the users and admins will be in hashed and salted format while saving for the first time in the database. This helps to protect the credentials even in a hacked database. In this scenario, the hacker will be getting the passwords in hashed and salted format which is irreversible to convert back to the original data. |
| JWT | JWT is an implementation of JSON web tokens. This package has been used to generate the web tokens for the users and admins during their signin process. After the user or admin has logged in or authenticated successfully, the token will be generated on the server side and sent to the client side as an response. From then, the client need to send the token along with the request header. This will check whether the client has permission to access certain routes or perform certain actions on a specific route. This token will carry email id, expiry duration for the token etc. as payloads. 

## Authors

* Subhankar Ghosh || subhankar.130495@gmail.com

## Acknowledgments

* [Academind](https://academind.com/)
* [Academind | Youtube](https://www.youtube.com/c/Academind)
