const express = require("express");
const router = express.Router();
const { check, validationResult } = require('express-validator');
const { signout,signup,signin,isSignedIn } = require("../controllers/auth");


// routs are here 
router.get("/signout",signout);

router.post("/signup",[
    check("name","name is required field").isLength({ min: 3 }),
    check("email","email is nessery").isEmail(),
    check("password","password is importent").isLength({ min: 5 })
],signup);

router.post("/signin",[
    check("email","email is nessery").isEmail(),
    check("password","password is importent").isLength({ min: 3 })
],signin);

router.get("/test",isSignedIn,(req,res) => {
    res.send("this is a secret sshhhhhhhh.....")
})

module.exports = router;