//Importing modules
const express = require("express");
const router = express.Router();
const adminsController = require("../controllers/admins");

//Routes with is corresponding controller
//controller file for admin holds the actual logic for each sub-routes (Example: /signup , /login etc.) under the main admin route
//admin signup
router.post("/signup", adminsController.admin_signup);
//admin login after the admin has successfully signed up
router.post("/login", adminsController.admin_login);
//delete an admin account
router.delete("/:adminId", adminsController.admin_delete);

//exporting the routes using express router module
module.exports = router;