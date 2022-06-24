//Importing modules
const jwt = require("jsonwebtoken");

module.exports = (req, res, next) =>{
    try {
         //This will get the authorization header with token with other information and will extract only the token
        const token = req.headers.authorization.split(" ")[1];
        //Token is getting verified and decoded
        //This token also carries issue time and expire time
        const decoded = jwt.verify(token, process.env.JWT_KEY_USER);
        req.userData = decoded;
        //Forwarding the user data using next() function
        next(req.userData);
    } catch (error) {
        return res.status(401).json({
            message: "Auth failed"
        });
        
    }   
};