//Importing modules
const http = require("http");
//Importing app.js
//Main entry point for all the business logic
const app = require("./app");

//Setting up the port number 
//We will get the port number from environmental variable named "PORT" or 3000 by default
//All the environment variables are listed in nodemon.json file
const port = process.env.PORT || 3000;

//Creating http server
//We are creating the server and redirecting it to app.js file which is the entry point for  all the business logic
const server = http.createServer(app);

//Server listening to the specified port
server.listen(port);