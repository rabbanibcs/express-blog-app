const path = require('path');
const userModel=require("../db/models/user")
const postModel=require("../db/models/post")
const categoryModel=require("../db/models/category")

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
    async getCategories (req,res){
        try {
            var categories=await categoryModel.find({})
            // console.log(posts);

        } catch (err) {
            console.log(err);
        }

        res.render(path.join(__dirname,'../templates/pages/admin_categories.ejs'),{categories})
    }
    async createCategory (req,res){
        try {
            var categories=await categoryModel.create({...req.body})
            // console.log(posts);

        } catch (err) {
            console.log(err);
        }
        res.redirect("/admin/categories")
    }
}

module.exports=new admin()