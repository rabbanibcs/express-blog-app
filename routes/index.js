const express = require('express');
const router = express.Router();
const indexController = require('../controllers/index')


/* GET home page. */
router.get('/', indexController.index);
/**Error page */
router.get('/error', indexController.error);
/**GET contact page */
router.get('/contact', indexController.contact);
/** GET about page */
router.get('/about', indexController.about);

module.exports = router;
