//Importing modules
const express = require("express");
const router = express.Router();
const usersController = require("../controllers/users");
//authentication middleware for admins
//Product manipulation should only be done by the admins
const checkAuthAdmin = require("../middleware/check-auth-admin");

//Routes with is corresponding controller
//Client can signup to become a registered user
router.post("/signup", usersController.user_signup);

//Client can login if he or she is already having a registered account
router.post("/login", usersController.user_login);

//This will delete a specific user
//Only an admin can perform this action
router.delete("/:userId", checkAuthAdmin, usersController.specific_user_delete);

//exporting the routes using express router module
module.exports = router;