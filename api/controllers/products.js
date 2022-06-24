//Importing modules
const mongoose = require("mongoose");
//importing the schema for products
const Product = require("../models/product"); 
const fs = require("fs");

//Route => products/ with a GET request
exports.get_all_products = (req, res, next) => {
    //we are not passing any arguments in find()
    //It means we are seraching for everything available inside the corresponsing collection
    Product.find()
        //which fields we want to fetch
        .select("_id title price image") 
        //find() does not return a real promise 
        //So, we need to use exec() function
        .exec()
        //We will pass an arrow function inside then() which suppose to run if the promise gets resolved by find()
        .then(docs => {
            const response = {
                //It will tell us how many products are there in total
                product_count: docs.length, 
                product_list: docs.map(doc => {
                    return {
                        product: {
                            id: doc.id,
                            title: doc.title,
                            price: doc.price,
                            image: doc.image
                        },
                        requests: {
                            type: "GET",
                            description: "Get more details about the product",
                            url: "http://localhost:3000/products/" + doc._id
                        }
                    }
                })
            };
            res.status(200).json(response);
        })
        //catch() will also take a function (in our case an arrow function) which will run if the promise gets rejected by find()
        .catch(err => {
            res.status(500).json({
                error: err
            });
        });
}

//Route => products/ with a POST request
//We have added a middleware for file upload
exports.create_new_product = (req, res, next) => {
    //creating a document in database under "products" collection, by creating a new instance or object using Product constructor
    const product = new Product({ 
        //we will supply the data using json object in body
        //Generating ID automatically (need not to mention in json body)
        _id: new mongoose.Types.ObjectId(),
        //"title": "some name" 
        title: req.body.title,
        //"description": "description about the product"
        description: req.body.description, 
        //"price": "some price"
        price: req.body.price,
        //We are entering file path in this field by fetching it during file submission
        //Replacing multer "\" with "/"
        image: req.file.path.replace("\\", "/")
    });
    product
        //saving the received and parsed body data to our database
        .save()
        //We will run this arrow function on promise resolve. We are receiving the response of the promise from save() in "result" variable
        .then(result => { 
            res.status(201).json(
                {
                    message: "Product created successfully",
                    created_product: {
                        id: result._id,
                        title: result.title,
                        description: result.description,
                        price: result.price,
                        //Replacing multer "\" with "/"
                        image: req.file.path.replace("\\", "/"), 
                        requests: [
                            {
                                type: "PATCH",
                                description: "Update the product",
                                url: "http://localhost:3000/products/" + result._id
                            },
                            {
                                type: "DELETE",
                                description: "Delete the product",
                                url: "http://localhost:3000/products/" + result._id
                            }
                        ]
                    }
                }
            );
        })
        //On promise rejection we are running this arrow function
        //We are receiving the response from save() in err
        .catch(err => { 
            res.status(500).json({
                //Returning whatever is there in "err" as a response
                error: err
            });
        });
}

//Route => products/:productId with a GET request
exports.get_specific_product = (req, res, next) => {
    //Receiving the product ID from from URL
    const id = req.params.productId;
    //Finding an item from "products" collection by its ID 
    Product.findById(id)
        //Which fields we want to fetch
        .select("_id title description price image")
        //findById() does not return a real promise
        //So, we need to use exec() function
        .exec()
        //We will run this arrow function on promise resolve
        //We are receiving the response of the promise from findById() in "doc" variable
        //In case the id does not exist in our database then doc will be "null"
        .then(doc => {
            //This response will be given for an ID which is present in our database
            //In that case "doc" will be the json data containing the corresponding document details from our database matching the provided ID
            if (doc) { 
                res.status(200).json({
                    product: doc
                });
            } else {
                //This response will be given for an ID which is not present in our database
                //In that case "doc" will be "null", 404 - Product not found.
                res.status(404).json({ message: "Product not found" }); 
            }
        })
        //On promise rejection we are running this arrow function
        //We are receiving the response from findById() in err
        .catch(err => {
            //This response will be given for an invalid ID like shortage of digit, number in the place of character
            //Basically something random and cannot be qualified as mongodb ID
            res.status(500).json({ error: err }); 
        });
}

//Route => products/:productId with a PATCH request
exports.update_specific_product = (req, res, next) => {
    const id = req.params.productId;
    //Creating an empty object
    //This object will hold the new data that needs to be updated or replaced for an item or document
    const updateOps = {}; 
    
    //Example:
    //In json body we have to send an array of objects with key pair values as follows
    /*
    [
        {
       "propName" : "title",
       "value" : "Modified Harry Potter 1"
        },
        {
       "propName" : "price",
       "value" : "5.66"
        }
    ]
    */

    //Each object is an ops
    //Using the for loop we are building up the object with required properties whose values need to be replaced in our database
    for (const ops of req.body) {
        updateOps[ops.propName] = ops.value;
    }
    //"updateOps" object building completed here

    //Now we wil update the existing values in our database
    //This mathod will help us to update one document at a time according to the provided ID
    Product.updateOne({ _id: id }, { $set: updateOps }) 
        //updateOne() does not return a real promise
        //So, we need to use exec() function       
        .exec() 
        //We will run this arrow function on promise resolve
        //We are receiving the response of the promise from updateOne() in "result" variable
        .then(result => {
            if (result.matchedCount == 0) {
                return res.status(200).json({
                    message: "Product cannot be updated",
                    reason: "Product not found",
                });
            }
            if (result.matchedCount == 1 && result.modifiedCount == 1) {
                //Finding an item from "products" collection by its ID 
                Product.findById(id) 
                    .select("_id title description price image")
                    .exec()
                    //We will run this arrow function on promise resolve
                    //We are receiving the response of the promise from findById() in "doc" variable
                    //In case the id does not exist in our database then doc will be "null"
                    .then(doc => {
                        return res.status(200).json({
                            message: "Product updated successfully",
                            updated_product: doc
                        });
                    })
                    .catch(err => {
                        //This response will be given for an invalid ID like shortage of digit, number in the place of character etc. 
                        //Basically, something random that cannot be qualified as mongodb ID
                        res.status(500).json({ error: err }); 
                    });
            }
            if (result.matchedCount == 1 && result.modifiedCount == 0) {
                return res.status(200).json({
                    message: "Product cannot be updated",
                    reason: "No new data entered",
                });
            }
        })
        //On promise rejection we are running this arrow function
        //We are receiving the response from updateOne() in err
        .catch(err => {
            res.status(500).json({
                error: err
            });
        });
}

//Route => products/:productId with a DELETE request
exports.delete_specific_product = (req, res, next) => {
    const id = req.params.productId;
    Product.findById(id)
        .select("image")
        .exec()
        .then(doc => {
            if (doc) {
                //Deleting file from server corresponding to the order id
                fs.unlink(doc.image, function (err) {
                    if (err) return res.status(200).json({ error: err });
                });
                //Deleting the correspondig order from database
                //This will help us to delete any one documnet whose ID is provided
                Product.deleteOne({ _id: id }) 
                    .exec()
                    .then(result => {
                        return res.status(200).json({
                            message: "Product deleted successfully",
                            request: {
                                type: "POST",
                                description: "Create a new product",
                                url: "http://localhost:3000/products",
                                body_type: "Form",
                                body_schema: {
                                    title: "String",
                                    description: "String",
                                    price: "Number",
                                    image: "File"
                                }
                            }
                        });
                    })
                    //On promise rejection we are running this arrow function
                    //We are receiving the response from deleteOne() in err
                    .catch(err => {
                        res.status(500).json({ error: err });
                    });
            } else {
                //This response will be given for an ID which is not present in our database
                return res.status(404).json({
                    message: "Product cannot be deleted",
                    reason: "Product not found",
                });
            }
        })
        //This will run on promise rejection from findById()
        //On promise rejection we are running this arrow function
        //We are receiving the response from findById() in err
        .catch(err => { 
            //This response will be given for an invalid ID like shortage of digit or number in the place of character etc. 
            //Basically, something random and cannot be qualified as mongodb ID
            res.status(500).json({ error: err });
        });
}