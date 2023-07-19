
const mongoose=require('mongoose');
const { boolean } = require('optimist');

mongoose.connect("mongodb://localhost:27017/GrandmaStories")
.then(()=>{console.log("Database Connected");})
.catch((err)=>{console.log(err);})

// create Collection =>>>>>>>>>>>>>>>>>>>>>>>>>
const usersSchema=new mongoose.Schema({
    email:{
        type:String,
        required:true
    },
    username:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    admin:{
        type:Boolean,
        default:false
    }
}) 

const users=new mongoose.model("users",usersSchema)



module.exports=users