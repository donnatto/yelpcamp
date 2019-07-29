//Defining variables
var express = require("express"),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose"),
    Campground = require("./models/campground"),
    app = express(),
    port = 3000;

mongoose.connect("mongodb://localhost:27017/yelpcamp", {useNewUrlParser: true});
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));


//Create a new campground and save to DB
// Campground.create({
    // name: "Salmon Creek",
    // image: "https://i1.wp.com/visitmckenzieriver.com/oregon/wp-content/uploads/2015/06/paradise_campground.jpg",
    // description: "This is Salmon Creek, very nice play."
// }, function(error, camp){
    // if(error){
        // console.log("error: " + error);
    // }else{
        // console.log("New camp added: " + camp);
    // }
// });

// var campgrounds = [
//     {name: "Salmon Creek", image: "https://i1.wp.com/visitmckenzieriver.com/oregon/wp-content/uploads/2015/06/paradise_campground.jpg?fit=640%2C480"},
//     {name: "Granite Hill", image: "https://ramblinpinescampground.com/images/Home-6-Boat.jpg"},
//     {name: "Pampa", image: "https://www.springfieldmn.org/vertical/Sites/%7BEAA6D6AB-E9E9-451A-BF61-D6988056DABE%7D/uploads/campground_play_area_1.JPG"},
//     {name: "Salmon Creek", image: "https://i1.wp.com/visitmckenzieriver.com/oregon/wp-content/uploads/2015/06/paradise_campground.jpg?fit=640%2C480"},
//     {name: "Granite Hill", image: "https://ramblinpinescampground.com/images/Home-6-Boat.jpg"},
//     {name: "Pampa", image: "https://www.springfieldmn.org/vertical/Sites/%7BEAA6D6AB-E9E9-451A-BF61-D6988056DABE%7D/uploads/campground_play_area_1.JPG"}
// ]

app.get("/", function(req,res){
    res.render("landing");
});

//INDEX - show all campgrounds
app.get("/campgrounds", function(req,res){
    //Get all campgrounds from DB
    Campground.find({}, function(error, camps){
        if(error){
            console.log("Error: " + error);
        }else{
            res.render("index", {campgrounds: camps});
        }
    })
});

//CREATE - add new campground to database
app.post("/campgrounds", function(req, res){
    //get data from form and add to campgrounds array
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.description;
    var newCamp = {name: name, image: image, description: desc};
    //Create a new campground and save to DB
    Campground.create(newCamp, function(error, camp){
        if(error){
            console.log("error: " + error);
        }else{
            console.log("New camp added: " + camp);
            //redirect back to camps page
            res.redirect("/campgrounds");
        }
    });
});

//NEW - show form to create a new campground
app.get("/campgrounds/new", function(req, res){
    res.render("new");
});

//SHOW - Shows info about one dog
app.get("/campgrounds/:id", function(req, res){
    //find the campground with provided ID
    Campground.findById(req.params.id, function(error, foundCamp){
        if(error){
            console.log(error);
        }else{
            //render show template with that campground
            res.render("show", {campground: foundCamp});
        }
    });
});

app.listen(port, function(){
    console.log("YelpCamp server started at port: " + port);
})