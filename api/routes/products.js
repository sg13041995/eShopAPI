//Importing modules
const express = require("express");
const router = express.Router();
const productsController = require("../controllers/products");
//This package will allow file submission
//It also supports body and params
const multer = require("multer");
//authentication middleware for admins
//Product manipulation should only be done by the admins
const checkAuthAdmin = require("../middleware/check-auth-admin");


//Multer specific code
//The disk storage engine gives us full control on storing files to disk. It takes destination and filename.
const storage = multer.diskStorage(
    {
        destination: function (req, file, cb) {
            //initializing multer
            //All the uploaded files will be stored here
            //The mentioned folder "uploads" is not available to the public so we have to make it a static folder manually
            //null as the first argument in cb (callback) is node error handling standard.
            cb(null, "uploads");
        },
        filename: function (req, file, cb) {
            let nowTime = new Date().toTimeString().slice(0, 8).replace(/:/g, "");
            let nowDate = new Date().toISOString().slice(2, 10).replace(/-/g, "");
            //We should avoid any character that is not allowed as file name
            cb(null, `${nowDate}-${nowTime}-${file.originalname}`);
        }
    });

//We are making sure that only png and jpg files are allowed to submit
//We are doing this with multer filefilter function 
const fileFilter = function fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(png|jpg|JPG)$/)) {
        //returning error if the uploaded file is not of specified format
        return cb(new Error('Please upload a Image')); 
    }
    cb(undefined, true);
}
//We are also restricting the uploaded file size to 1MB
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 1
    },
    fileFilter: fileFilter
});

//Routes with is corresponding controller
//This will get all the available product list
//Any client will be able to access this
//No need of any login
router.get('/', productsController.get_all_products);

//This will post a new product
//Only admin can do that
router.post('/', checkAuthAdmin, upload.single("image"), productsController.create_new_product);

//This will get a specific product details by its id
//Any client will be able to access this
//No need of any login
router.get('/:productId', productsController.get_specific_product);

//This will update a specific product byits id
//Only admin can do this
router.patch('/:productId', checkAuthAdmin, productsController.update_specific_product);

//This will delete a specific product
//Only admin can do this
router.delete('/:productId', checkAuthAdmin, productsController.delete_specific_product);

//exporting the routes using express router module
module.exports = router;