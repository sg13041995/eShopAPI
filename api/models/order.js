//Importing modules
const mongoose = require("mongoose");

//Defining the schema for order
const orderSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true},
    quantity: { type: Number, default: 1}, // if not enetered then will be considered as 1
    customer_id: {type: String, required: true },
    customer_email: {type: String, required: true },
    date: {type: String, required: true },
    time: {type: String, required: true }
});

//Exporting the model by embedding the schema
//It is a convention to use the capital letter and singular form in model name
//The model name "Order" will be converted into "orders", every letter will be small and plural form will be used with an added "s" => "orders" for collection
module.exports = mongoose.model("Order", orderSchema);