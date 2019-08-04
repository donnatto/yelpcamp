const express = require('express');
// eslint-disable-next-line new-cap
const router = express.Router();
const Campground = require('../models/campground');
const middleware = require('../middleware');

// INDEX - show all campgrounds
router.get('/', function(req, res) {
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
router.post('/', middleware.isLoggedIn, function(req, res) {
  // get data from form and add to campgrounds array
  const name = req.body.name;
  const image = req.body.image;
  const desc = req.body.description;
  const author = {
    id: req.user._id,
    username: req.user.username,
  };
  const newCamp = {name: name, image: image, description: desc, author: author};
  // Create a new campground and save to DB
  Campground.create(newCamp, function(error, camp) {
    if (error) {
      console.log('error: ' + error);
    } else {
      // console.log('New camp added: ' + camp);
      // redirect back to camps page
      res.redirect('/campgrounds');
    }
  });
});

// NEW - show form to create a new campground
router.get('/new', middleware.isLoggedIn, function(req, res) {
  res.render('campgrounds/new');
});

// SHOW - Shows info about one dog
router.get('/:id', function(req, res) {
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

// EDIT Route
router.get('/:id/edit', middleware.checkCampOwnership, function(req, res) {
  Campground.findById(req.params.id, function(err, foundCamp) {
    res.render('campgrounds/edit', {campground: foundCamp});
  });
});
// UPDATE Route
router.put('/:id', middleware.checkCampOwnership, function(req, res) {
  // Find and Update the correct camp
  Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCamp) {
    if (err) {
      res.redirect('/campgrounds');
    } else {
      res.redirect('/campgrounds/' + req.params.id);
    }
  });
});

// DESTROY Route
router.delete('/:id', middleware.checkCampOwnership, function(req, res) {
  Campground.findByIdAndRemove(req.params.id, function(err, campRemoved) {
    if (err) {
      res.redirect('/campgrounds');
    } else {
      // Comment.deleteMany({_id: {$in: campRemoved.comments}}, function(err) {
      //   if (err) {
      //     console.log(err);
      //   }
      res.redirect('/campgrounds');
      // });
    }
  });
});

module.exports = router;
