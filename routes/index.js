const express = require('express');
const passport = require('passport');
const User = require('../models/user');
// eslint-disable-next-line new-cap
const router = express.Router();

// Root route
router.get('/', function(req, res) {
  res.render('landing');
});

// Show register form
router.get('/register', function(req, res) {
  res.render('register');
});
// Sign Up logic
router.post('/register', function(req, res) {
  const newUser = new User({username: req.body.username});
  User.register(newUser, req.body.password, function(err, user) {
    if (err) {
      console.log(err);
      return res.render('register');
    }
    passport.authenticate('local')(req, res, function() {
      res.redirect('/campgrounds');
    });
  });
});

// Show Login form
router.get('/login', function(req, res) {
  res.render('login');
});
// Handling login logic
router.post('/login', passport.authenticate('local',
    {
      successRedirect: '/campgrounds',
      failureRedirect: '/login',
    }), function(req, res) {
});

// Logout route
router.get('/logout', function(req, res) {
  req.logout();
  res.redirect('/campgrounds');
});

/**
 * Middleware function to check if user is logged in
 * @param {*} req request param
 * @param {*} res response param
 * @param {*} next next action
 * @return {*} next()
 */
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login');
}

module.exports = router;
