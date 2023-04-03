const router = require('express').Router();
const {adminOnly}=require('../middlewares/common')


const adminController=require('../controllers/admin')
router.get("/",adminOnly,adminController.getUsers)
router.get("/users",adminOnly,adminController.getUsers)
router.get("/posts",adminOnly,adminController.getPosts)
router.get("/categories",adminOnly,adminController.getCategories)
router.post("/categories",adminOnly,adminController.createCategory)


module.exports=router