const Product = require("../models/product");
const formidable = require("formidable")
const _ = require("lodash")
const fs = require("fs")

exports.getProductById = (req,res,next,id) => {
    Product.findById(id).populate("category")
    .exec((err,product) => {
        if(err) {
            return res.status(400).json({
                error : "product not found"
            })
        }
        req.product = product;
        next();

    })
}

// creating controler 

exports.createProduct = (req,res) => {
    let form = new formidable.IncomingForm();
    form.keepExtensions = true;

    form.parse(req, (err,fields,file) =>{
        if(err){
            return res.status(400).json({
                error : "problum with image "
            })
        }

        const {name,description,price,category,stock,photo} = fields;
        
        if(!name || !description || !price || !category || !stock){
            return res.status(400).json({
                error : "please include all fields"
            })
        }
        // TODO: ristrictions on fields ------>
        let product = new Product(fields);
        // handel file here 
        if(file.photo){
            if(file.photo.size >3000000 ){
                return res.status(400).json({
                    error : "file is to large to upload "
                })
            }
            console.log(file.photo)

            product.photo.data = fs.readFileSync(file.photo.path)
            product.photo.contentType = file.photo.type
        }
        //save the database ---->
        product.save((err,product) => {
            if(err){
                return res.status(400).json({
                    error : "unable to save data in database"
                })
            }
            res.json(product);
        })
    })
}


// read controler ====>
exports.getProduct = (req,res) => {
    req.product.photo = undefined;
    return res.json(req.product)
}

exports.photo = (req,res,next) => {
    if (req.product.photo.data) {
        res.set("Content-Type",req.product.photo.contentType)
        return res.send(req.product.photo.data)
    }
    next();
}

// delete controler ====== >

exports.deleteProduct = (req,res) => {
    let product = req.product;
    product.remove((err,deleted) => {
        if (err) {
            return res.json({
                error : "unable to delete product please try again"
            })
        }
        res.json({
            message : "successfully deleted item ",
            deleted
        })
    })
}

// update product controler 

exports.updateProduct = (req,res) => {
    let form = new formidable.IncomingForm();
    form.keepExtensions = true;

    form.parse(req, (err,fields,file) =>{
        if(err){
            return res.status(400).json({
                error : "problum with image "
            })
        }

        
        // TODO: ristrictions on fields ------>
        let product = req.product;
        product = _.extend(product , fields);
        // handel file here 
        if(file.photo){
            if(file.photo.size >3000000 ){
                return res.status(400).json({
                    error : "file is to large to upload "
                })
            }
            console.log(file.photo)

            product.photo.data = fs.readFileSync(file.photo.path)
            product.photo.contentType = file.photo.type
        }
        //save the database ---->
        product.save((err,product) => {
            if(err){
                return res.status(400).json({
                    error : "unable to update data in database"
                })
            }
            res.json(product);
        })
    })
}

exports.getAllProducts = (req,res) => {
    let limit = req.query.limit ? parseInt(req.query.limit): 8;
    let sortBy = req.query.sortBy ? req.query.sortBy : "_id";

    Product.find()
        .select("-photo")
        .populate("category")
        .sort([[sortBy , "asc"]])
        .limit(limit)
        .exec((err,products) => {
            if(err){
                return res.status(400).json({
                    error : "unable to access the products"
                })
            }
            res.json(products)
        })
}

exports.updateStock = (req , res, next ) =>{
    let myOprations = req.body.order.product.map(prod => {
        return {
            updateOne: {
                filter : {_id : prod._id},
                update : {$inc: { stock : -prod.count, sold : +prod.count}}
            }
        }
    });
    Product.bulkWrite(myOprations,{},(err,products) => {
        if(err){
            return res.status(400).json({
                error : "bulk opration failed"
            })
        }
        next();
    })
}


exports.getAllUniqueCategories = (req,res) => {
    Product.distinct("category",{},(err, category) => {
        if (err) {
            return res.status(400).json({
                error : " category not found"
            })
        }
        res.json(category);
    })
}