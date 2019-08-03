const express = require('express');
const router = express.Router();
const Campground = require('../models/campground');

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
router.post('/', function(req, res) {
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
router.get('/new', function(req, res) {
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

module.exports = router;
