//Importing modules
const express = require("express");
const morgan = require("morgan");
const mongoose = require("mongoose");

//Creating new express application
const app = express();

//Importing route files in app.js with custom names
const productRoutes = require("./api/routes/products");
const orderRoutes = require("./api/routes/orders");
const adminRoutes = require("./api/routes/admins");
const userRoutes = require("./api/routes/users");

//MongoDB Atlas
//Connecting to our cloud based database (MongoDB Atlas)
//We are importing the "password" and "database name" from environmental variables "MONGODB_ATLAS_PW" and "MONGO_ATLAS_DB" written in nodemon.json file respectively
mongoose.connect(`mongodb+srv://nodeShop:${process.env.MONGO_ATLAS_PW}@cluster0.rf8ec.mongodb.net/${process.env.MONGO_ATLAS_DB}?retryWrites=true&w=majority`);

//Specifying Middlewares
//Before routing the request we will pass them through "morgan" so that we can fetch the logs
app.use(morgan("dev"));

//We are making the "uploads" a static folder in express
app.use("/uploads", express.static("uploads"));

//This will help us to parse incoming request with urlencoded data or payload
//{extended: false} means the value can be only "string" or "array" not of any other type like "json"
app.use(express.urlencoded({ extended: false }));

//This will help us to parse json data usually comes from the body
app.use(express.json());

//CORS specifications
//We are specifying some criteria about the headers which we will be receiving through requests
app.use((req, res, next) => {
    //ACAO is a CORS header. Here I am mentioning "*" means any IP address or origin can ask for resources from me
    //Clients's browser or app will check the CORS details or permissions specified on my RESTful API server by sending pre-flight request   
    res.header("Access-Control-Allow-Origin", "*");
    //These headers are allowed while making some request to my API  
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    //These methods are only allowed while requesting to my API
    //Browser or client side app may check it by sending a request with OPTIONS method
    if (req.method === "OPTIONS") {
        res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
        return res.status(200).json({
            message: "The allowed request methods are as follows",
            methods: "PUT, POST, PATCH, DELETE, GET"
        });
    }
    //If the request method is anything other than OPTIONS then the request will be forwarded to the next line of code
    return next(); 
});

//We are redirecting the requested paths (Example: /products or /orders) to our desired files or routes that holds further business logic
app.use("/admins", adminRoutes);
app.use("/users", userRoutes);
app.use("/products", productRoutes);
app.use("/orders", orderRoutes);

//Error handling at main route level
//If the request cannot be handled by the above routes then definitely that is an invalid request
//It simply means, requested route doesn't exist in my API. So, those requests will come here and receive the necessary error message
app.use((req, res, next) => {
    //Creating new error object
    const error = new Error("Not Found"); 
    //Setting up a status code of 404 (page not found or invalid request) correspondingto that error object
    error.status = 404; 
    //The error object is getting passed to the next middleware using next() function
    next(error); 
});
//This middleware receives the previous error object as the first argument
app.use((error, req, res, next) => {
    //setting response status as error status mentioned in the error object or 500
    res.status(error.status || 500);
    //Sending a json response 
    res.json( 
        {
            error: {
                message: error.message,
                status: error.status
            }
        }
    );
});
//exporting the whole sourcecode of this file as app
module.exports = app;