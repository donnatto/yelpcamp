// Defining variables
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const passport = require('passport');
const LocalStrategy = require('passport-local');
// eslint-disable-next-line no-unused-vars
const Campground = require('./models/campground');
// eslint-disable-next-line no-unused-vars
const Comment = require('./models/comment');
const User = require('./models/user');
// const seedDB = require('./seeds');
const app = express();
const port = 3000;

// Requiring routes
const campgroundRoutes = require('./routes/campgrounds');
const commentRoutes = require('./routes/comments');
const indexRoutes = require('./routes/index');

// seedDB();
mongoose.connect('mongodb://localhost:27017/yelpcamp', {
  useNewUrlParser: true,
});
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
// eslint-disable-next-line no-undef
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

app.use(indexRoutes);
app.use('/campgrounds', campgroundRoutes);
app.use('/campgrounds/:id/comments', commentRoutes);

app.listen(port, function() {
  console.log('YelpCamp server started at port: ' + port);
});
