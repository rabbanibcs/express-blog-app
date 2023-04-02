const db = require('mongoose');

const userSchema= new db.Schema({
    name:{type:String,require:true},
    email: {type:String,required:true},
    password:{type:String,required:true},
    gender:{type:Number,default: 1},
    phone:{type:String,required:false},
    about:{type:String,required:false},
    admin:{type:Boolean,default: 0},
    image:{
        data: Buffer,
        contentType: String,
    },
    joinedAt:{
        type:Date,
        default:Date.now
    }

})

const userModel=db.model('user',userSchema)
module.exports=userModel