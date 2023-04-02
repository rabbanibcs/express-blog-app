const router = require('express').Router();


const admin=require('../controllers/admin')
const adminController=new admin()
router.get("/",adminController.getUsers)
router.get("/users",adminController.getUsers)
router.get("/posts",adminController.getPosts)


module.exports=router