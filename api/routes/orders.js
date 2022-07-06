//Importing modules
const express = require("express");
const router = express.Router();
//importing authentication middleware for users
const checkAuthUser = require("../middleware/check-auth-user");
//authentication middleware for admins
const checkAuthAdmin = require("../middleware/check-auth-admin"); 
const ordersController = require("../controllers/orders");

//Routes with is corresponding controller
//Get all available orders from the database
//Only admin can access it.
router.get('/all', checkAuthAdmin, ordersController.get_all_orders);

//Get all orders specific to an user
//user can access this after login
//It will show his or her own orders list
router.get('/', checkAuthUser, ordersController.get_user_specific_order);

//Post a new order
//users can do this after login
//Product to be placed as order will be mentioned in the body of the request using json
router.post('/', checkAuthUser, ordersController.place_order);

//Get order details by order id
//Only admin can do this
router.get('/:orderId', checkAuthAdmin, ordersController.get_specific_order);

//Delete an order
//An user can do this after login to delete his or her previously placed orders
router.delete('/:orderId', checkAuthUser, ordersController.delete_specific_order);

//exporting the routes using express router module
module.exports = router;