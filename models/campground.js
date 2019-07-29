var mongoose = require("mongoose");
//Schema Setup
var campgroundSchema = mongoose.Schema({
  name: String,
  image: String,
  description: String
});

module.exports = mongoose.model("Campground", campgroundSchema);
