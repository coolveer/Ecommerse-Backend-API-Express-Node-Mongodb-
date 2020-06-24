const { check, validationResult } = require('express-validator');
const User = require("../models/user");
var jwt = require('jsonwebtoken');
var expressJwt = require('express-jwt');

exports.signup = (req,res) => {

    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(422).json({
            error : errors.array()[0].msg,
            errin : errors.array()[0].param
        })
    }

    const user = new User(req.body);
    user.save((err,user) => {
        
        if(err){
            console.log("i am here");
            return res.status(400).json({
                err : "not able to save in tha database"
            });
        }
        res.json({
            name : user.name,
            email: user.email,
            id : user._id
        });
    })
}


exports.signin = (req,res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(422).json({
            error : errors.array()[0].msg,
            errin : errors.array()[0].param
        })
    }

    const {email , password} = req.body;
    User.findOne({email},(err,user) => {
        if(err || !user){
            return res.status(400).json({
                error : "USER email doesn't exist"
            })
        }

        if(!user.authenticate(password)){
            return res.status(401).json({
                error : "EMAIL or PASSWORD not matched "
            })
        }
        //creating token
        const token = jwt.sign({_id : user._id}, process.env.SECRET);
        //setting this token in cookie 
        res.cookie("token",token,{expire : new Date()+9999});
        //send response to frontend
        const {_id,name,email,role} = user ;
        return res.json({token , user : {_id,name,email,role}})
    })
}


exports.signout = (req,res) => {
    res.clearCookie("token");
    res.json({
        message : "sigout complete"
    });
}

// protected routs 

exports.isSignedIn = expressJwt({
    secret : process.env.SECRET,
    userProperty : "auth"
});

// coustom middlewhere

exports.isAuthenticated = (req, res,next) => {
    let checker = req.profile && req.auth && req.profile._id == req.auth._id
    if(!checker){
        return res.status(403).json({
            error : "ACCESS DENIED"
        })
    }
    next()
}

exports.isAdmin = (req, res,next) => {
    if(req.profile.role ===0){
        return res.status(403).json({
            error : "you are not aadmin, ACCESS DENIED"
        })
    }
    next()
}