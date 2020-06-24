var mongoose = require('mongoose');
const crypto = require('crypto');
const v1 =  require('uuid');
const uuidv1 = v1.v1;

var userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        trim:true,
        maxlength:32
    },
    lastName:{
        type:String,
        trim:true,
        maxlength:32
    },
    email:{
        type:String,
        trim:true,
        required:true,
        unique:true
    },
    useringo:{
        type:String,
        trim:true
    },
    //todo:come again
    encry_password:{
        type:String,
        trim:true
    },
    salt:String,
    role:{
        type:Number,
        default:0
    },
    purchases:{
        type:Array,
        default:[]
    }
},{timestamps:true});

userSchema.virtual("password")
    .set(function(password){
        this._password = password
        this.salt = uuidv1();
        this.encry_password = this.securePassword(password);
    })
    .get(function(){
        return this._password
    })

userSchema.methods = {
    authenticate : function(plainPassword){
        return this.securePassword(plainPassword) === this.encry_password
    },
    securePassword : function(plainPassword){
        if(!plainPassword) return "";
        try {
            return crypto.createHmac('sha256', this.salt)
            .update(plainPassword)
            .digest('hex');
            console.log(hash);
        } catch (err) {
            return "";
        }
    }

}

module.exports = mongoose.model("User",userSchema);