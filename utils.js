const userModel = require('./db/models/user')
var validator = require('validator');
const port = 8000
const bcrypt = require('bcrypt');
const saltRounds = 10;

const createAdmin=async (name,email,password)=>{
    if(!validator.isEmail(email)){
        console.log("Invalid email.");
        return false;
    }else{
        bcrypt.hash(password, saltRounds, (err, password) => {
            const user = userModel({ name, email, password, admin:true })
            user.save()
        })
        console.log('Admin was created successfully.');
        
    }
    
}
module.exports=createAdmin