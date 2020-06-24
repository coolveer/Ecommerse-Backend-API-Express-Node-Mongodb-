const express = require("express");
const router = express.Router();

const {
    getCategoryById,
    createCategory,
    getCategory,
    getAllCategory,
    updateCategory,
    removeCategory} = require("../controllers/category");
const {isAdmin,isSignedIn,isAuthenticated} = require("../controllers/auth");
const {getUserById} = require("../controllers/user");

// middle where

router.param("userId",getUserById);
router.param("categoryId",getCategoryById);

// routs goes here 
// create category 
router.post("/category/create/:userId",isSignedIn,isAuthenticated,isAdmin,createCategory);
//read category
router.get("/category/all",getAllCategory);
router.get("/category/:categoryId",getCategory);

//update category 
router.put("/category/:categoryId/:userId",isSignedIn,isAuthenticated,isAdmin,updateCategory);
//delete category
router.delete("/category/:categoryId/:userId",isSignedIn,isAuthenticated,isAdmin,removeCategory);




module.exports = router;

