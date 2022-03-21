//import mongoose
const mongoose=require('mongoose');

//require connection string to connect server to mongoDB
 mongoose.connect('mongodb://localhost:27017/bankApp',{useNewUrlParser:true});

 //to create the model

 const User=mongoose.model('User',{
     acno:Number,
     uname:String,
     password:String,
     balance:Number,
     transaction:[]

 })

 //to export model
 module.exports={
     User
    }
