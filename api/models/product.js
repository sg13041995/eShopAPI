//Importing modules
const mongoose = require("mongoose");

//Defining the schema for product
const productSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    title: {type: String, required: true},
    description: {type: String, required: true},
    price: {type: String, required: true},
    //This is the file path (file will be there in our server's root directory inside a folder named "uploads")
    image: {type: String, required: true}  
});

//Exporting the model by embedding the schema
//It is a convention to use the capital letter and singular form in model name
//The model name "Product" will be converted into "products", every letter will be small and plural form will be used with an added "s" => "products" for collection
module.exports = mongoose.model("Product", productSchema);