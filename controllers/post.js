const path = require('path');
const postModel = require('../db/models/post')
const { commentModel, subCommentModel } = require('../db/models/comment')
const userModel = require('../db/models/user')
const fs = require('fs');

class post {

    viewPostForm(req, res) {
        res.render(path.join(__dirname, '../templates/pages/postCreate.ejs'))
    }

    /**create a new post */
    async createPost(req, res) {
        const image = {
            data: fs.readFileSync(path.join(process.cwd() + '/uploads/' + req.file.filename)),
            contentType: req.file.mimetype
        }
        try {
            var post = await postModel.create({ ...req.body, image, user: req.user.id })
            res.redirect(`/post/view?id=${post._id}`)
        } catch (err) {
            console.log(err.message);
            res.redirect(`/error?message=${err.message}`)
        }

    }

    async viewPost(req, res) {
        /**catch post id */
        var post_id = req.query.id
        try {
            var post = await postModel.findOne({ _id: post_id }).populate([{
                path: "comments",
                populate: [{
                    path: "subComments",
                    populate: {
                        path: "user",
                    },
                }, {
                    path: "user",
                }]

            }, {
                path: "user"
            }])
            /**fetch previous post */
            var previous_post = await postModel.find({ _id: { $lt: post_id } }, { title: 1 }).sort({ _id: -1 }).limit(1)
            /**fetch next post */
            var next_post = await postModel.find({ _id: { $gt: post_id } }, { title: 1 }).sort({ _id: 1 }).limit(1)
            post.next = next_post[0]
            post.previous = previous_post[0]
            /**only owner of a post can edit the post */
            if (req.isAuthenticated() && req.user.id === post.user.id) {
                res.locals.editPost = true

            }
            res.render(path.join(__dirname, '../templates/pages/viewPost.ejs'), { post })
        } catch (err) {
            console.log(err.message);
            res.redirect(`/error?message=${err.message}`)
        }
    }
    /**update a post */
    async updatePost(req, res) {
        try {
            const { title, content, category, id } = req.body
            await postModel.updateOne({ _id: req.body.id }, { $set: { title, content, category } })
            res.redirect(`/post/view?id=${id}`)

        } catch (err) {
            console.log(err.message);
            res.redirect(`/error?message=${err.message}`)
        }

    }
    /**post update form */
    async postUpdateForm(req, res) {
        try {
            var post = await postModel.findOne({ _id: req.query.id })
            console.log(post.user);
            /** admin or author of the post*/
            if (post.user == req.user.id || req.user.admin) {
                res.locals.editPost = true
                res.render(path.join(__dirname, '../templates/pages/postEdit.ejs'), { post })

            } else {
                var message = "You are a ghost"
                res.redirect(`/error?message=${message}`)

            }
        } catch (err) {
            console.log(err.message);
            res.redirect(`/error?message=${err.message}`)

        }


    }
    /**category wise posts */
    async fetchPostsByCategory(req, res) {
        try {
            var posts = await postModel.find({ category: req.query.category })
            // console.log(posts);
            if (posts.length === 0) {
                var message = "No post found"
                res.redirect(`/error?message=${message}`)
                return;
            } else {
                res.render(path.join(__dirname, '../templates/pages/posts.ejs'), { posts: posts })
                return;

            }

        } catch (err) {
            console.log(err.message);
            res.redirect(`/error?message=${err.message}`)
        }

    }
    async search(req, res) {
        const keywords = req.query.keywords;
        var posts = await postModel.find({
            $text:
            {
                $search: keywords,
            }
        })
        console.log(posts);
        res.render(path.join(__dirname, '../templates/pages/posts.ejs'), { posts: posts })
    }
}
module.exports = new post()