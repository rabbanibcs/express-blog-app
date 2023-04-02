const db = require('mongoose');

const categorySchema= new db.Schema({
    name:{type:String,require:true},

})

const categoryModel=db.model('categories',categorySchema)
module.exports=categoryModel