//Importing modules
const mongoose = require("mongoose");

//Defining the schema for admin
const adminSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    email: {
        type: String,
        required: true,
        unique: true,
        match: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
    },
    password: {type: String, required: true},

});

//Exporting the model by embedding the schema
//It is a convention to use the capital letter and singular form in model name
module.exports = mongoose.model("Admin", adminSchema);