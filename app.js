// Defining variables
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const flash = require('connect-flash');
const passport = require('passport');
const methodOverride = require('method-override');
const LocalStrategy = require('passport-local');
// eslint-disable-next-line no-unused-vars
const Campground = require('./models/campground');
// eslint-disable-next-line no-unused-vars
const Comment = require('./models/comment');
const User = require('./models/user');
// const seedDB = require('./seeds');
const app = express();
let port = process.env.PORT;
if (port == null || port == '') {
  port = 3000;
}

// Requiring routes
const campgroundRoutes = require('./routes/campgrounds');
const commentRoutes = require('./routes/comments');
const indexRoutes = require('./routes/index');

// seedDB();
mongoose.connect(process.env.DATABASEURL, {
  useNewUrlParser: true,
  useFindAndModify: false,
});
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
// eslint-disable-next-line no-undef
app.use(express.static(__dirname + '/public'));
app.use(methodOverride('_method'));
app.use(flash());

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
  res.locals.error = req.flash('error');
  res.locals.success = req.flash('success');
  next();
});

app.use(indexRoutes);
app.use('/campgrounds', campgroundRoutes);
app.use('/campgrounds/:id/comments', commentRoutes);

app.listen(port, function() {
  console.log('YelpCamp server started at port: ' + port);
});
