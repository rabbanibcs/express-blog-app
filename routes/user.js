const router = require('express').Router();
const userController = require('../controllers/user')
const passport = require('passport');
const LocalStrategy = require('passport-local');
const { loginRequired, authenticatedUserNotAllowed, adminOrSelf } = require('../middlewares/common')
const multer = require('multer')
const upload = multer({ dest: 'uploads/users' })


passport.use(new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password'
}, userController.verifyUser));

passport.serializeUser(function (user, cb) {
  process.nextTick(function () {
    cb(null, { id: user.id, email: user.email, admin: user.admin });
  });
});

passport.deserializeUser(function (user, cb) {
  process.nextTick(function () {

    return cb(null, user);
  });
});


/* GET signin page. */
router.get('/signin', authenticatedUserNotAllowed, userController.login);
router.post('/signin', passport.authenticate('local', { failureRedirect: '/error?message="Athentication failed. May be you are not a registered user."' }),
  (req, res) => {
    // console.log(req);
    res.redirect('/');

  });

/* GET signup page. */
router.get('/signup', authenticatedUserNotAllowed, userController.createUser);
router.post('/signup', userController.createUser);

router.get('/signout', loginRequired, function (req, res, next) {
  req.logout((err) => {
    if (err) { return next(err); }
    res.redirect('/');
  });
});

/* GET profile page. */
router.get('/profile', loginRequired, userController.profile);
router.post('/profile', loginRequired, upload.single('image'), userController.updateProfile);

module.exports = router;