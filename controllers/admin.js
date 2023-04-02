const path = require('path');
const userModel=require("../db/models/user")
const postModel=require("../db/models/post")
class admin{
    constructor(){

    }
    async getUsers (req,res){
        try {
            var users=await userModel.find({})
            // console.log(users);

        } catch (err) {
            console.log(err);
        }



        res.render(path.join(__dirname,'../templates/pages/admin_users.ejs'),{users})
    }
    async getPosts (req,res){
        try {
            var posts=await postModel.find({}).populate('user')
            // console.log(posts);

        } catch (err) {
            console.log(err);
        }

        res.render(path.join(__dirname,'../templates/pages/admin_posts.ejs'),{posts})
    }
}

module.exports=admin