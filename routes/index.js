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
      req.flash('error', err.message);
      return res.redirect('/register');
    }
    passport.authenticate('local')(req, res, function() {
      req.flash('success', 'Welcome to Yelpcamp ' + user.username);
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
      failureFlash: true,
    }), function(req, res) {
});

// Logout route
router.get('/logout', function(req, res) {
  req.logout();
  req.flash('success', 'Logged you out!');
  res.redirect('/campgrounds');
});

module.exports = router;
