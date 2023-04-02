const path = require('path');
const userModel=require('../db/models/user')
const postModel=require('../db/models/post')
const fs = require('fs');

const bcrypt = require('bcrypt');
const saltRounds = 10;

/**Must be logged in */
const profile=async(req,res)=>{
    if(req.query.id){
        /** Admin or user self are allowed */
        if(req.user.admin || req.query.id==req.user.id){
            try {
                /**get user info and his/her posts */
                var user_info=await userModel.findOne({_id:req.query.id})
                const posts=await postModel.find({user:req.query.id},{image:0})
                res.render(path.join(__dirname,'../templates/pages/profile.ejs'),{user_info,posts})
            
            } catch (err) {
                console.log(err.message);
                res.redirect(`/error?message=${err.message}`)
            }

        }else{
            // console.log(error);
            res.redirect("/error")
        }
           
        
        
    }else{
        /**show profile who is logged in */
        try {
            const user_info=await userModel.findOne({_id:req.user.id})
            const posts=await postModel.find({user:req.user.id},{image:0})
            res.render(path.join(__dirname,'../templates/pages/profile.ejs'),{user_info,posts})
        
        } catch (err) {
            console.log(err.message);
            res.redirect(`/error?message=${err.message}`)
            
        }
       
    }
    
}
const updateProfile=async(req,res)=>{
    // console.log(req.body.user_id);
    const user_id=req.body.user_id
    if(req.file){
        const image={
            data: fs.readFileSync(path.join(process.cwd() + '/uploads/users/' + req.file.filename)),
            contentType: req.file.mimetype
        }
        await userModel.findOneAndUpdate({_id:user_id},{image})
    }else{
        const user=await userModel.findOneAndUpdate({_id:user_id},{$set:{
            ...req.body
        }})
    
    }
    res.redirect(`/user/profile?id=${user_id}`)

}

const verifyUser=async(email,password,cb)=>{
    // console.log('verifing user...');
    // check if user with given email exists
    const user=await userModel.findOne({email}).exec()
    if(user){
        const isMatch=await bcrypt.compare(password, user.password)
        if(isMatch){
            return cb(null, user);
        }else{
            return cb(null, false, { message: 'Incorrect password ' }); 
        }

    }else{
        return cb(null, false, { message: 'Email is not registered ' }); 
    }
}

const login=async(req,res,next)=>{
    res.render(path.join(__dirname,'../templates/pages/signin.ejs'))
}

const createUser=async(req,res)=>{
    const {name,email,password,password2,gender}=req.body

    if(req.route.methods.get){
        // if get request, serve registration page
        res.render(path.join(__dirname,'../templates/pages/signup.ejs'))

    }else if(req.route.methods.post){
        // check if email already exists
        const userExists=await userModel.findOne({email}).exec()
        if(userExists){
            res.render(path.join(__dirname,'../templates/pages/signup.ejs'),{message:'Email already exists.'})

        }else{
            // check if both password matched
            if(password===password2){
                bcrypt.hash(password,saltRounds,(err,password)=>{
                    const user=userModel({name,email,password,gender})
                    user.save()
                    res.redirect("/user/signin")
                })
                
            }else{
                res.render(path.join(__dirname,'../templates/pages/signup.ejs'),{message:'Both password did not match.'})
            }

        }

    }

}

module.exports={login,createUser,verifyUser,profile,updateProfile}