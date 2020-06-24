const Category = require("../models/category");

exports.getCategoryById = (req,res,next,id) => {
    Category.findById(id).exec((err,cate) => {
        if(err){
            return res.status(400).json({
                error : "category not found in database"
            })
        }
        req.category = cate;
        next();
    })
}

exports.createCategory = (req,res) => {
    const category = new Category(req.body);
    category.save((err,category) => {
        if(err){
            return res.status(400).json({
                error : "not able to save category in database "
            })
        }
        res.json(category)
    })
}

exports.getCategory = (req,res) => {
    res.json(req.category)
}

exports.getAllCategory = (req,res) => {
    Category.find().exec((err,allitems) => {
        if(err){
            return res.status(400).json({
                error : "category not found"
            })
        }
        res.json(allitems)
    })
}

exports.updateCategory = (req,res) => {
    const category = req.category;
    category.name = req.body.name;
    category.save((err,updatedItem) => {
        if(err){
            return res.status(400).json({
                error : "category not found"
            })
        }
        res.json(updatedItem)
    })
}

exports.removeCategory = (req,res) => {
    const category = req.category;
    category.remove((err,delitem) => {
        if(err){
            return res.status(400).json({
                error : "category not found"
            })
        }
        res.json({
            message : "successfully deleted"
        })
    })
}