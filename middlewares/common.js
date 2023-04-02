
var createError = require('http-errors')
const categoryModel=require('../db/models/category')


const authenticatedUserNotAllowed=(req,res,next)=>{
    if(req.isAuthenticated()){
        res.redirect('/');
    }else{
      next()
    }
  }
  
const loginRequired=(req,res,next)=>{
    if(req.isUnauthenticated()){
        res.redirect('/user/signin');
    }else{
      next();
    }
  }
  function logIn(req, res, next) {
    if (!req.user) return next(createError(401, 'Please login to view this page.'))
    next()
  }
  const getCategories=async(req,res,next)=>{
    var categories=await categoryModel.find({},{_id:0})
    res.locals.categories=categories
    if (req.session.passport) { 
      res.locals.user = req.session.passport.user;
      res.locals.editPost = false;
  
    }
    next()
  }
/** Admin or user self are allowed */
const adminOrSelf=(req,res,next)=>{
  if(req.user.admin==true || req.user.id==req.query.id){
    next()
  }else{
    res.redirect("/")

  }
}

  
  module.exports={loginRequired,logIn,adminOrSelf,
    getCategories,authenticatedUserNotAllowed}