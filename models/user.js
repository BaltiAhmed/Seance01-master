const mongoose =require("mongoose")
const uniqueValidator = require('mongoose-unique-validator')
const schema = mongoose.Schema;

const userSchema = new schema({
    name:{type:String,required:true},
    email:{type:String,required:true,unique:true},
    password:{type:String,required:true,minlenght:8},
    produits:[{type:mongoose.Types.ObjectId,required:true,ref:'produit'}]


})

userSchema.plugin(uniqueValidator)

module.exports = mongoose.model('user',userSchema)