const path = require('path');
const userModel=require('../db/models/user')
const postModel=require('../db/models/post')

const getUser=async(id)=>{
    var user=await userModel.findOne({_id:id})
    return user
}
const index=async(req,res)=>{
    console.log(req.user);
    const currentPage=req.query.page||1
    if(currentPage<1){
        res.redirect("/")
    }else{
        const size=2
        posts=await postModel.find({}).skip(size*(currentPage-1)).limit(size)
        /**pagination */
        var total_posts=await postModel.find({}).count()
        console.log('total posts',total_posts);
        var pages=[]
        for (let i = 1; i <= total_posts; i++) {
            if(i%size==0){
                pages.push(i/size)
            }
          }
          if(total_posts%size!=0){
            pages.push(Math.ceil(total_posts/size))
          }
          console.log(pages);
        res.render(path.join(__dirname,'../templates/pages/index.ejs'), { posts,pages,currentPage })
    }
}
    
const contact=async(req,res)=>{

    res.render(path.join(__dirname,'../templates/pages/contact.ejs'))
}
const about=async(req,res)=>{

    res.render(path.join(__dirname,'../templates/pages/about.ejs'))
}
const error=async(req,res)=>{
    const error=req.query.message
    res.render(path.join(__dirname,'../templates/pages/error.ejs'),{error})
}
module.exports={index,contact,about,error};

