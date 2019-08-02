// Defining variables
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const passport = require('passport');
const LocalStrategy = require('passport-local');
// seedDB = require('./seeds'),
const Campground = require('./models/campground');
const Comment = require('./models/comment');
const User = require('./models/user');
// seedDB = require('./seeds'),
const app = express();
const port = 3000;

// seedDB();
mongoose.connect('mongodb://localhost:27017/yelpcamp', {
  useNewUrlParser: true,
});
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + '/public'));

// Passport configuration
app.use(require('express-session')({
  secret: 'Chismi wins',
  resave: false,
  saveUninitialized: false,
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next) {
  res.locals.currentUser = req.user;
  next();
});

app.get('/', function(req, res) {
  res.render('landing');
});

// INDEX - show all campgrounds
app.get('/campgrounds', function(req, res) {
  // Get all campgrounds from DB
  Campground.find({}, function(error, camps) {
    if (error) {
      console.log('Error: ' + error);
    } else {
      res.render('campgrounds/index',
          {campgrounds: camps});
    }
  });
});

// CREATE - add new campground to database
app.post('/campgrounds', function(req, res) {
  // get data from form and add to campgrounds array
  const name = req.body.name;
  const image = req.body.image;
  const desc = req.body.description;
  const newCamp = {name: name, image: image, description: desc};
  // Create a new campground and save to DB
  Campground.create(newCamp, function(error, camp) {
    if (error) {
      console.log('error: ' + error);
    } else {
      console.log('New camp added: ' + camp);
      // redirect back to camps page
      res.redirect('/campgrounds');
    }
  });
});

// NEW - show form to create a new campground
app.get('/campgrounds/new', function(req, res) {
  res.render('campgrounds/new');
});

// SHOW - Shows info about one dog
app.get('/campgrounds/:id', function(req, res) {
  // find the campground with provided ID
  Campground.findById(req.params.id)
      .populate('comments')
      .exec(function(error, foundCamp) {
        if (error) {
          console.log(error);
        } else {
          // render show template with that campground
          res.render('campgrounds/show', {campground: foundCamp});
        }
      });
});

// ================
// Comments Routes
// ================

app.get('/campgrounds/:id/comments/new', isLoggedIn, function(req, res) {
  // find campground by id
  Campground.findById(req.params.id, function(err, campground) {
    if (err) {
      console.log(err);
    } else {
      res.render('comments/new', {campground: campground});
    }
  });
});

app.post('/campgrounds/:id/comments', isLoggedIn, function(req, res) {
  // lookup campground using ID
  Campground.findById(req.params.id, function(err, campground) {
    if (err) {
      console.log(err);
      res.redirect('/campgrounds');
    } else {
      Comment.create(req.body.comment, function(err, comment) {
        if (err) {
          console.log(err);
        } else {
          campground.comments.push(comment);
          campground.save();
          res.redirect('/campgrounds/' + campground._id);
        }
      });
    }
  });
});

// ===========
// AUTH ROUTES
// ===========

app.get('/register', function(req, res) {
  res.render('register');
});
app.post('/register', function(req, res) {
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
app.get('/login', function(req, res) {
  res.render('login');
});
// Handling login logic
app.post('/login', passport.authenticate('local',
    {
      successRedirect: '/campgrounds',
      failureRedirect: '/login',
    }), function(req, res) {
});

// Logout route
app.get('/logout', function(req, res) {
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

app.listen(port, function() {
  console.log('YelpCamp server started at port: ' + port);
});
