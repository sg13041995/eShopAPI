//Importing modules
const mongoose = require("mongoose");
//importing the schema for orders
const Order = require("../models/order");
//importing the schema for product as well because we also need it for showing product details after the order has been placed.
const Product = require("../models/product");

//Route controller functions
//Route => orders/all with GET request
exports.get_all_orders = (req, res, next) => {
    Order.find()
        //which fields we want to fetech from each document
        //We may have 10 fiels bu we may need only 3 out of them
        .select("_id product quantity customer_id") 
        .exec()
        //We will run this arrow function on promise resolve
        //We are receiving the response of the promise from find() in "docs" variable
        //"docs" will be an array of objects
        .then(docs => { 
            res.status(200).json({
                //Total number of order regarding the variety of product
                //The count does not include the order number of each product
                order_count: docs.length,
                //In the array, "doc" will become one object element at a time (from top to bottom one by one)
                //This will allow us to access the internal properties of the corresponsing object as it is at a certain point in time.   
                order_list: docs.map(doc => {  
                    return {
                        order_id: doc._id,
                        product_id: doc.product,
                        order_quantity: doc.quantity,
                        customer_id: doc.customer_id,
                        customer_email: doc.customer_email,
                    }
                })
            });
        })
        //On promise rejection we are running this arrow function
        //We are receiving the response from find() in err
        .catch(err => { 
            res.status(500).json({
                error: err
            });
        });
}

//Route => orders/ with a POST request
exports.place_order = (userData, req, res, next) => {
    //we will pass a json during this request from body
    //That json will contain two properties with their values => "productId" and "quantity".
    Product.findById(req.body.product_id)
        //We will run this arrow function on promise resolve
        //We are receiving the response of the promise from findById() in "product" variable
        //This variable will have product details from "products" collection.
        .then(product => { 
            //if product not found against the entered ID we will get this response
            //The ID must be a valid one but not necessarily a listed one from database to make it work
            //Converting null to true with NOT operator
            if (!product) {
                return res.status(404).json({
                    message: "Product not found"
                });
            }
            let nowTime = new Date().toTimeString().slice(0, 8).replace(/:/g, "-");
            let nowDate = new Date().toISOString().slice(2, 10);
            //creating a document in database under "orders" collection, by creating a new instance or object using Order constructor
            const order = new Order({
                    //order ID
                    _id: mongoose.Types.ObjectId(),
                    //product ID that we have ordered
                    product: req.body.product_id,
                    //order quantity
                    quantity: req.body.quantity,
                    customer_id: userData.userId,
                    customer_email: userData.email,
                    date: nowDate,
                    time: nowTime
                });
                //saving the received and parsed body data to our database
                //We are performing this, only if the entered product ID was a valid one
                return order.save();
        })
        //If order gets saved successfully, this then() will run
        //Because save() returns a real promise and so we will handle that with this()
        //We are passing an arrow function and receiving the returned value by save(), on promise resolve in "result" variable
        .then(result => {
            //201 - code indicates that the request has succeeded and has led to the creation of a resource (Created success status response)
            res.status(201).json({
                message: "Order placed successfully",
                order_details: {
                    //order ID
                    order_id: result._id,
                    //product ID
                    product_id: result.product,
                    //quantity
                    product_quantity: result.quantity, 
                    customer_email: result.customer_email 
                },
                requests: {
                    type: "DELETE",
                    description: "Delete the product",
                    url: "http://localhost:3000/orders/" + result._id
                }
            });
        })
        //On promise rejection we are running this arrow function
        //This error will be thrown if we enter an invalid ID or something goes wrong on the server side
        .catch(err => { 
            res.status(500).json({
                message: "Product not found",
                error: err
            });
        });
}

//Route => orders/:orderId with a GET request
exports.get_specific_order = (req, res, next) => {
    //receiving the product ID from from URL
    const id = req.params.orderId;
    //Finding an item from "orders" collection by its ID
    Order.findById(id) 
        .select("_id product quantity customer_id customer_email date time")
        //findById() does not return a real promise. So, we need to use exec() function
        .exec() 
        //We will run this arrow function on promise resolve
        //We are receiving the response of the promise from findById() in "order" variable
        .then(order => { 
            //if order not found according to the entered ID, we get this response
            //ID must be a valid one but not necessarily a listed one from database to make it work
            //Converting null into true with NOT operator
            if (!order) {
                return res.status(404).json({
                    message: "Order not found"
                });
            }
            //If the order exist in our database based on the entered ID
            res.status(200).json({ 
                order: order,
                request: {
                    type: "GET",
                    description: "Get all the available orders",
                    url: "http://localhost:3000/orders"
                }
            });
        })
        //On promise rejection we are running this arrow function. This error will be thrown if we enter an invalid ID or something goes wrong on the server side
        .catch(err => { 
            res.status(500).json({ error: err });
        });
}

//Route => orders/ with a GET request
exports.get_user_specific_order = (userData, req, res, next) => {
    //Receiving and storing the logged in user ID 
    const userId = userData.userId; 
    //Finding items from "orders" collection by customer ID as user ID
    Order.find({ customer_id: userId }) 
        .select("_id product quantity")
        //find() does not return a real promise. So, we need to use exec() function
        .exec() 
        //We will run this arrow function on promise resolve
        //We are receiving the response of the promise from find() in "docs" variable
        //"docs" will be an array of objects
        .then(docs => {
            res.status(200).json({
                order_count: docs.length, 
                order_list: docs.map(doc => { 
                    return {
                        order_id: doc._id,
                        product_id: doc.product,
                        order_quantity: doc.quantity,
                    }
                })
            });
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        });
}

//Route => orders/:orderId with a DELETE request
exports.delete_specific_order = (userData, req, res, next) => {
    //receiving the order ID from from URL
    const id = req.params.orderId;
    //This will help us to delete any one documnet whose ID is provided
    Order.remove({ _id: id }) 
        //remove() does not return a real promise, so we need to use exec() function
        .exec()
        //We will run this arrow function on promise resolve
        //We are receiving the response of the promise from remove() in "result" variable
        .then(result => { 
            res.status(200).json({
                message: "Order deleted successfully",
                request: {
                    type: "POST",
                    description: "Place an order of a new product",
                    url: "http://localhost:3000/orders",
                    body: { product_id: "_id", quantity: "Number" }
                }
            });
        })
        //On promise rejection we are running this arrow function
        //We are receiving the response from remove() in err
        .catch(err => { 
            res.status(500).json({ error: err });
        });
}