
var createError = require('http-errors')
var categoryModel = require('../db/models/category')

class middleware {

  authenticatedUserNotAllowed(req, res, next) {
    if (req.isAuthenticated()) {
      var message = "You are already logged in"
      res.redirect(`/error?message=${message}`)
    } else {
      next()
    }
  }

  loginRequired(req, res, next) {
    if (req.isUnauthenticated()) {
      var message = "You are not logged in"
      res.redirect(`/error?message=${message}`)
    } else {
      next();
    }
  }

  async getCategories(req, res, next) {
    var categories = await categoryModel.find({}, { _id: 0 })
    res.locals.categories = categories
    if (req.session.passport) {
      res.locals.user = req.session.passport.user;
      res.locals.editPost = false;

    }
    next()
  }
  /** Admin or user self are allowed */
  adminOrSelf(req, res, next) {
    if (req.user.admin == true || req.user.id == req.query.id) {
      next()
    } else {
      res.redirect("/")

    }
  }
  /**only admin is allowed */
  adminOnly(req, res, next) {
    if (req.isAuthenticated()) {
      if (req.user.admin) {
        next()

      } else {
        var message = "You are not Admin"
        res.redirect(`/error?message=${message}`)
      }
    } else {
      var message = "You are not logged in"
      res.redirect(`/error?message=${message}`)
    }
  }
}


module.exports = new middleware()