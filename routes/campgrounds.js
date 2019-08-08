const express = require('express');
// eslint-disable-next-line new-cap
const router = express.Router();
const Campground = require('../models/campground');
const middleware = require('../middleware');
const NodeGeocoder = require('node-geocoder');

const options = {
  provider: 'google',
  httpAdapter: 'https',
  apiKey: process.env.MAPSKEY,
  formatter: null,
};

const geocoder = NodeGeocoder(options);

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
  const price = req.body.price;
  const image = req.body.image;
  const desc = req.body.description;
  const author = {
    id: req.user._id,
    username: req.user.username,
  };
  geocoder.geocode(req.body.location, function(err, data) {
    if (err || !data.length) {
      req.flash('error', 'Invalid address');
      return res.redirect('back');
    }
    const lat = data[0].latitude;
    const lng = data[0].longitude;
    const location = data[0].formattedAddress;
    const newCampground = {name: name, price: price, image: image, description: desc, author: author, location: location, lat: lat, lng: lng};
    // Create a new campground and save to DB
    Campground.create(newCampground, function(error, camp) {
      if (error) {
        console.log('error: ' + error);
      } else {
        // redirect back to camps page
        req.flash('success', 'Campground created!');
        res.redirect('/campgrounds');
      }
    });
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
  geocoder.geocode(req.body.location, function(err, data) {
    if (err || !data.length) {
      req.flash('error', 'Invalid address');
      return res.redirect('back');
    }
    req.body.campground.lat = data[0].latitude;
    req.body.campground.lng = data[0].longitude;
    req.body.campground.location = data[0].formattedAddress;
    // Find and Update the correct camp
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCamp) {
      if (err) {
        req.flash('error', err.message);
        res.redirect('back');
      } else {
        req.flash('success', 'Successfully updated!');
        res.redirect('/campgrounds/' + req.params.id);
      }
    });
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
