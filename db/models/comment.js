const db = require('mongoose');

const commentSchema= new db.Schema({
    user: {
        type:db.Types.ObjectId,
        ref:"user"
    },
    
    message:{type:String,require:true},
    subComments:[{
        type:db.Types.ObjectId,
        ref:"subComment"
    }],
    createdAt:{
        type:Date,
        default:Date.now
    }
})


const subCommentSchema= new db.Schema({
    user: {
        type:db.Types.ObjectId,
        ref:"user"
    },
    message:{type:String,require:true},
    createdAt:{
        type:Date,
        default:Date.now
    }
})
const commentModel=db.model('comment',commentSchema)
const subCommentModel=db.model('subComment',subCommentSchema)
module.exports={commentModel,subCommentModel}