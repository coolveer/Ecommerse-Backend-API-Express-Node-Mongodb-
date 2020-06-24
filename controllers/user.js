const User = require("../models/user");
const Order = require("../models/order");

exports.getUserById = (req, res, next , id ) => {
    User.findById(id).exec((err, user ) => {
        if(err || !user){
            return res.status(400).json({
                error : "no user found in database"
            });
        }
        req.profile = user;
        next();
    })
}

exports.getUser = (req, res) => {
    // todo: get back here for password 
    req.profile.salt = undefined;
    req.profile.encry_password = undefined;
    req.profile.createdAt = undefined;
    req.profile.updatedAt = undefined;

    return res.json(req.profile);
}

exports.updateUser = (req,res) => {
    User.findByIdAndUpdate(
        {_id : req.profile._id},
        {$set : req.body},
        {new : true,useFindAndModify : false},
        (err,user) => {
            if(err) {
                return res.status(400).json({
                    error : "faild to update in tha database"
                })
            }
            user.salt = undefined;
            user.encry_password = undefined;
            res.json(user);
        }
    )
}

exports.userPerchaseList = (req,res) => {
    Order.find({_id:req.profile._id})
    .populate("user","_id name")
    .exec((err,order) => {
        if (err || !order) {
            return res.status(400).json({
                error : " there is no order in this accoumt"
            })
        }
        res.json(order)
    })
}
exports.pushOrderInPurchaseList = (req,res,next) => {
    let purchase = [];
    req.body.order.products.forEach(product => {
        purchases.push({
            _id : product._id,
            name : product.name,
            description : product.description,
            category : product.category,
            quantity : product.quantity,
            amount : req.body.order.amount,
            transaction_id : req.body.order.transaction_id
        })
    });
    User.findOneAndUpdate(
        {_id : req.profile._id},
        {$push: {purchases : purchases}},
        {new : true},
        (err, purchase) => {
            if(err || !purchase) {
                return res.status(400).json({
                    error : "unable to save purchase list "
                })
            }
            next();
        }
    )
}