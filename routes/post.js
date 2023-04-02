const multer  = require('multer')
const router = require('express').Router();
const postController=require('../controllers/postController')
const commentController=require('../controllers/commentController')
const upload = multer({ dest: 'uploads/' })
const {loginRequired,logIn}=require('../middlewares/common')

/**fetch posts by a category */
router.get('/search',postController.search);
/**fetch posts by a category */
router.get('/',postController.fetchPostsByCategory);
/**view a single post */
router.get('/view',postController.viewPost);
/**view post create form */
router.get('/create',loginRequired,postController.viewPostForm);
/**create post */
router.post('/create', upload.single('image'),postController.createPost);
/**view post update form */
router.get('/edit',loginRequired,postController.postUpdateForm);
/**update post */
router.post('/edit',loginRequired,postController.updatePost);
 /** create comment */
router.post('/comment',loginRequired,commentController.comment);
router.post('/subcomment',loginRequired,commentController.subComment);

module.exports = router;