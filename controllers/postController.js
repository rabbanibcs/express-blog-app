const path = require('path');
const postModel=require('../db/models/post')
const {commentModel,subCommentModel}=require('../db/models/comment')
const userModel=require('../db/models/user')
const fs = require('fs');

const viewPostForm=(req,res)=>{
    res.render(path.join(__dirname,'../templates/pages/postCreate.ejs'))
}
const createPost=async(req,res)=>{
    const image={
        data: fs.readFileSync(path.join(process.cwd() + '/uploads/' + req.file.filename)),
        contentType: req.file.mimetype
    }
    try {
        var post=await postModel.create({...req.body,image,user:req.user.id})
        res.redirect(`/post/view?id=${post._id}`)
    } catch (err) {
        console.log(err.message);
        res.redirect(`/error?message=${err.message}`)
    }
    
}

const viewPost=async(req,res)=>{
    var post_id=req.query.id
    try {
        var post=await postModel.findOne({_id:post_id}).populate([{
            path:"comments",
            populate:[{
                path:"subComments",
                populate:{
                    path:"user",
                },
            },{
                path:"user",
            }]
            
        },{
            path:"user"
        }])
        // console.log(post.user.id);
        var previous_post=await postModel.find({_id:{$lt:post_id}},{title:1}).sort({_id:-1}).limit(1)
        var next_post=await postModel.find({_id:{$gt:post_id}},{title:1}).sort({_id:1}).limit(1)
        post.next=next_post[0]
        post.previous=previous_post[0]  
        if(req.isAuthenticated() && req.user.id===post.user.id){
            res.locals.editPost=true
    
        }
        res.render(path.join(__dirname,'../templates/pages/viewPost.ejs'), { post})
    } catch (err) {
        console.log(err.message);
        res.redirect(`/error?message=${err.message}`)
    }
}

const updatePost=async(req,res)=>{
    try {
        const {title,content,category,id}=req.body
        await postModel.updateOne({_id:req.body.id},{$set:{title,content,category}})
        res.redirect(`/post/view?id=${id}`)

    } catch (err) {
        console.log(err.message);
        res.redirect(`/error?message=${err.message}`)
    }
    
}

const postUpdateForm=async(req,res)=>{
    try {
        post=await postModel.findOne({_id:req.query.id})
        console.log(post.user);
        /** admin or author of the post*/
        if(post.user==req.user.id || req.user.admin){
            res.locals.editPost=true
            res.render(path.join(__dirname,'../templates/pages/postEdit.ejs'), { post })

        }else{
            var message="You are a ghost"
        res.redirect(`/error?message=${message}`)

        }
    } catch (err) {
        console.log(err.message);
        res.redirect(`/error?message=${err.message}`)
        
    }
    

}
/**category wise posts */
const fetchPostsByCategory=async(req,res)=>{
    try {
        posts=await postModel.find({category:req.query.category})
        res.render(path.join(__dirname,'../templates/pages/posts.ejs'), { posts: posts })
        
    } catch (err) {
        console.log(err.message);
        res.redirect(`/error?message=${err.message}`)
    }

}
const search=async(req,res)=>{
    const keywords=req.query.keywords;
    posts=await postModel.find({
        $text:
          {
            $search: keywords,
          }
      })
      console.log(posts);
    res.render(path.join(__dirname,'../templates/pages/posts.ejs'), { posts: posts })
}
module.exports={search,createPost,viewPost,postUpdateForm,updatePost,viewPostForm,fetchPostsByCategory}