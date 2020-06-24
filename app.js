
require('dotenv').config();

const express = require("express");
const mongoose = require("mongoose");
const app =express();
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");

// my routes 

const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");
const categoryRoutes = require("./routes/category");
const productRoutes = require("./routes/product");
const orderRoutes = require("./routes/order");

// database connections
mongoose.connect(process.env.DATABASE,{
    useNewUrlParser:true,
    useUnifiedTopology:true,
    useCreateIndex:true
} ).then(() =>{
    console.log("DATABASE IS CONNECTED")
});
// middle wares 
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors());
// my routs 
app.use("/api",authRoutes);
app.use("/api",userRoutes);
app.use("/api",categoryRoutes);
app.use("/api",productRoutes);
app.use("/api",orderRoutes);

// port 
const port = process.env.PORT || 7000;
// starting a server 
app.listen(port,() => {
    console.log("server is runing")
})
