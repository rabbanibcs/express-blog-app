const express = require('express');
const router = express.Router();
const indexController=require('../controllers/indexController')


/* GET home page. */
router.get('/',indexController.index);
/**GET contact page */
router.get('/contact',indexController.contact);
/** GET about page */
router.get('/about',indexController.about);

module.exports = router;
