//Defining variables
var express = require("express"),
  bodyParser = require("body-parser"),
  mongoose = require("mongoose"),
  // seedDB = require("./seeds"),
  Campground = require("./models/campground"),
  Comment = require("./models/comment"),
  // seedDB = require("./seeds"),
  app = express(),
  port = 3000;

// seedDB();
mongoose.connect("mongodb://localhost:27017/yelpcamp", {
  useNewUrlParser: true
});
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", function(req, res) {
  res.render("landing");
});

//INDEX - show all campgrounds
app.get("/campgrounds", function(req, res) {
  //Get all campgrounds from DB
  Campground.find({}, function(error, camps) {
    if (error) {
      console.log("Error: " + error);
    } else {
      res.render("campgrounds/index", { campgrounds: camps });
    }
  });
});

//CREATE - add new campground to database
app.post("/campgrounds", function(req, res) {
  //get data from form and add to campgrounds array
  var name = req.body.name;
  var image = req.body.image;
  var desc = req.body.description;
  var newCamp = { name: name, image: image, description: desc };
  //Create a new campground and save to DB
  Campground.create(newCamp, function(error, camp) {
    if (error) {
      console.log("error: " + error);
    } else {
      console.log("New camp added: " + camp);
      //redirect back to camps page
      res.redirect("/campgrounds");
    }
  });
});

//NEW - show form to create a new campground
app.get("/campgrounds/new", function(req, res) {
  res.render("campgrounds/new");
});

//SHOW - Shows info about one dog
app.get("/campgrounds/:id", function(req, res) {
  //find the campground with provided ID
  Campground.findById(req.params.id)
    .populate("comments")
    .exec(function(error, foundCamp) {
      if (error) {
        console.log(error);
      } else {
        //render show template with that campground
        res.render("campgrounds/show", { campground: foundCamp });
      }
    });
});

// ================
// Comments Routes
// ================

app.get("/campgrounds/:id/comments/new", function(req, res) {
  // find campground by id
  Campground.findById(req.params.id, function(err, campground) {
    if (err) {
      console.log(err);
    } else {
      res.render("comments/new", { campground: campground });
    }
  });
});

app.post("/campgrounds/:id/comments", function(req, res) {
  // lookup campground using ID
  Campground.findById(req.params.id, function(err, campground) {
    if (err) {
      console.log(err);
      res.redirect("/campgrounds");
    } else {
      Comment.create(req.body.comment, function(err, comment) {
        if (err) {
          console.log(err);
        } else {
          campground.comments.push(comment);
          campground.save();
          res.redirect("/campgrounds/" + campground._id);
        }
      });
    }
  });
});

app.listen(port, function() {
  console.log("YelpCamp server started at port: " + port);
});
