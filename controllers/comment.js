var path = require('path');
const userModel = require('../db/models/user')
const { commentModel, subCommentModel } = require('../db/models/comment')
const postModel = require('../db/models/post')


const comment = async (req, res) => {
    // console.log(req.user);
    const comment = await commentModel.create({ user: req.user.id, message: req.body.message })
    var post = await postModel.updateOne({ _id: req.body.post_id }, { $push: { comments: comment._id } })

    res.redirect(`/post/view?id=${req.body.post_id}`)
}

const subComment = async (req, res) => {
    const { comment_id, message, post_id } = req.body
    const subComment = await subCommentModel.create({ message, user: req.user.id })
    const comment = await commentModel.updateOne({ _id: comment_id }, { $push: { subComments: subComment._id } })
    res.redirect(`/post/view?id=${post_id}`)
}
module.exports = { comment, subComment };

