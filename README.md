# eShop_

This is an eCommerce RESTful API written in Nodejs. This API is designed to utilize the association of MongoDB Atlast for database support. It has features like signup, login for users and admins separately. It has order and product routes with authentication and authorization implemented. For example, only Admin can create, update, delete products etc. Any client can view all the available products but only authorized or logged in users can place orders, view and update own orders etc.

## Description

This is an eCommerce RESTful API project that includes basic, standard features that can be implemented with different eCommerce application with required modifications if any. This project has been designed in Nodejs using different external packages for functionalities and express as the main framework. I have used MongoDB Atlas as the database service partner. It is a cloud-native document database as a service.

* The packages used in this project are as follows:

| Library | Application |
| --- | --- |
| Mongoose | Mongoose library helps to create a connection between MongoDB and the Express web application framework. It provides a straight-forward, schema-based solution to model our application data. |
| Multer | Multer middleware has been used to handle the file uploads in my project. I have provided file filter to check file size and format as well. It helps to get the file and save it in aproper directory with proper format of filename. Multer adds a body object and file object to the request object. So, we can get the values of the text fields of the form through body object and the uploaded file from the file object. |
| Morgan | Morgan middleware has been used to get the request and response log. It is a http request logger middleware. |
| Bcrypt | Bcrypt library has been used to be able to hash and salt the password of admins and users during the their signup while saving the password to the database. The credential of the users and admins will be in hashed and salted format while saving for the first time in the database. This helps to protect the credentials even in a hacked database. In this scenario, the hacker will be getting the passwords in hashed and salted format which is irreversible to convert back to the original data. |
| JWT | JWT is an implementation of JSON web tokens. This package has been used to generate the web tokens for the users and admins during their signin process. This web token will be sent along with the header during the request from the client side. After the user or admin has logged in or authenticated successfully, the token will be generated onthe server side and sent to the client as an response. From then, the client need to send the token along with the request header. This will check whether the client has permission to access certain routes or perform certain actions on a specific route.

## Authors

* Subhankar Ghosh || subhankar.130495@gmail.com

## Acknowledgments

* [Academind](https://academind.com/)
* [Academind | Youtube](https://www.youtube.com/c/Academind)
