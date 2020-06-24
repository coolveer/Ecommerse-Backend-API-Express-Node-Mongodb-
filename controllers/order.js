const {Order,ProductCart} = require("../models/order");

exports.getOrderById = (req , res , next , id ) => {
    Order.findById(id).populate("products.product","name price")
    .exec((err,order) => {
        if (err) {
            return res.status(400).json({
                error : " no order found in the database "
            })
        }
        req.order = order;
    })
}

exports.createOrder = (req,res) => {
    req.body.order.user = req.profile
    const order = new Order(req.body.order)
    order.save((err,order) => {
        if (err) {
            return res.status(400).json({
                error : " no order found in the database "
            })
        }
        res.json(order)
    })
}

exports.getAllOrders = (req,res) => {
    Order.find()
    .populate("user","_id name")
    .exec((err,orders) => {
        if (err) {
            return res.status(400).json({
                error : " no order found in the database "
            })
        }
        res.json(orders)
    })
}

exports.getOrderStatus = (req,res) => {
    res.json(Order.schema.path("status").enumValues)
}

exports.updateStatus = (req,res) => {
    Order.update(
        {_id : req.body.orderId},
        {$set : {status : req.body.status}},
        (err,status) => {
            if (err) {
                return res.status(400).json({
                    error : " no order found in the database "
                })
            }
            res.json(status)
        }
    )
}