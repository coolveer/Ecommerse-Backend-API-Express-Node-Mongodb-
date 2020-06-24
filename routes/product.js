const express = require("express");
const router = express.Router();

const {isAuthenticated,isSignedIn,isAdmin} = require('../controllers/auth');
const {getUserById} = require('../controllers/user');
const {getProductById,createProduct,getProduct,photo, updateProduct,deleteProduct,getAllProducts} = require('../controllers/product');

// all of the params goes here 

router.param("userId",getUserById);
router.param("productId",getProductById);

// all of actual routes 
//read all products 
router.get("/products",getAllProducts);
//create route
router.post("/product/create/:userId",isSignedIn,isAuthenticated,isAdmin,createProduct);
// read rout
router.get("/product/:productId",getProduct);
router.get("/product/photo/:productId",photo);
//update route 
router.put("/product/:productId/:userId",isSignedIn,isAuthenticated,isAdmin,updateProduct);
// delete route
router.delete("/product/:productId/:userId",isSignedIn,isAuthenticated,isAdmin,deleteProduct);


module.exports = router;