const db = require('mongoose');
const userModel=require('./user')
const {commentModel,subCommentModel}=require('./comment')

const postSchema= new db.Schema({
    title:{type:String,require:true},
    category: {type:String,required:true},
    content: {type:String,required:true},
    user: {
        type:db.Types.ObjectId,
        ref:"user"
    },
    comments:[{
        type:db.Types.ObjectId,
        ref:"comment"
    }],
    image:{
        data: Buffer,
        contentType: String,
    },
    createdAt:{
        type:Date,
        default:Date.now
    }

})
postSchema.index({ title: 'text',content:'text'})
const postModel=db.model('post',postSchema)
// postModel.createIndexes();
module.exports=postModel