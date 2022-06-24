//Importing modules
const mongoose = require("mongoose");
//This will help us in encryption (actually hash and salt) of data
const bcrypt = require("bcrypt");
//Importing the schema for products
const Admin = require("../models/admin");
//This will help us to authenticate admin and user through tokens. It can generate tokens and also verify it when sent with the header of the request
const jwt = require("jsonwebtoken");

//Route controller functions
//Route => admins/signup with POST request
exports.admin_signup = (req, res, next) => {
    //Checking whether the same email already exist or not. We will send json through body with both email and password
    Admin.find({ email: req.body.email })
        //find() query does not return a real promise
        //So, we need to use exec() function
        .exec()
        //If the promise is resolved by find() successfully then in the next step we will check if the same email already exist or not
        .then(admin => {
            // If admin (email) exist already then length will be greater than 1
            if (admin.length >= 1) {
                //The HTTP 409 status code indicates that the request could not be processed because of conflict in the request, such as the requested resource is not in the expected state, or the result of processing the request would create a conflict within the resource. 
                res.status(409).json({
                    message: "email already exist"
                });
            } else {
                //10 is number of salting characters
                //It will insert 10 random characters within the actual password string
                bcrypt.hash(req.body.password, 10, (err, hash) => {
                    if (err) {
                        return res.status(500).json({
                            error: err
                        });
                        //If email is new one then we will go ahead and hash and salt the password, so that if the server gets hacked, then also the admin password will remain safe (in an unreadable and irreversible format)
                    } else {
                        //Generating document with model constructor
                        const admin = new Admin({
                            //Admin id 
                            _id: mongoose.Types.ObjectId(),
                            //Admin email
                            email: req.body.email,
                            //Hashed and salted password 
                            password: hash
                        });
                        //Saving the document in the collection in our database
                        admin.save()
                            .then(result => {
                                res.status(201).json({
                                    message: "Admin created successfully",
                                    admin: {
                                        id: result._id,
                                        email: result.email,
                                    }
                                });
                            })
                            .catch(err => {
                                res.status(500).json({
                                    error: err
                                });
                            });
                    }
                });
            }
        });
}

//Route => admins/login with POST request
exports.admin_login = (req, res, next) => {
    //Checking whether the entered email exist or not. We will send json through body with both email and password.
    Admin.find({ email: req.body.email })
        .exec()
        .then(admin => {
            // If admin does not exist then length will be less than 1 or 0
            if (admin.length < 1) {
                res.status(401).json({
                    message: "Auth failed"
                });
            }
            // If email exist we are proceeding to check whether the password is correct or not
            //[entered password] vs [database saved password] and then a [callback function - either error or post matched object]
            bcrypt.compare(req.body.password, admin[0].password, (err, result) => {
                //Next two of the "if statements" comes inside this bcrypt.compare() function
                //If password did not match
                if (err) {
                    return res.status(401).json({
                        message: "Auth failed"
                    })
                }
                //If password matches then its time to generate a token and also to share that as response 
                //This token will be valid for some specified time
                //This token can be used for authentication purpose by the client side by sending the token through the header of the request
                //Result will exist or become true only when the previous match password test is successful
                if (result) {
                    //Generating the token with these payloads 
                    const token = jwt.sign({
                        //Admin Email
                        email: admin[0].email,
                        //Admin id  
                        adminId: admin[0]._id,
                    },  
                        //Admin key from nodemon.js file
                        process.env.JWT_KEY_ADMIN,
                        {
                            //expire duration
                            expiresIn: "1h"
                        });
                    return res.status(200).json({
                        message: "Auth successful",
                        //Generated jwt token
                        token: token 
                    });
                }
                // If both the "if statement" crossed or not satisfied then definitely authentication failed
                res.status(401).json({
                    message: "Auth failed"
                });
            });
        })
        //If something goes wrong on the server side
        .catch(err => {
            res.status(500).json({
                error: err
            });
        });
}

//Route => admins/:adminId with DELETE request
exports.admin_delete = (req, res, next) => {
    //We need to enter admin id in the url 
    let id = req.params.adminId;
    //Even if the admin (admin id) does not exist still it will show admin deleted successfully as it is not initially checking whether admin exist or not
    //It is okay in this case because trying to delete an admin who doesn't exist, doesn't make any sense
    Admin.deleteOne({ _id: id })
        .exec()
        .then(result => {
            res.status(200).json({
                message: "Admin deleted successfully"
            });
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        });
}

