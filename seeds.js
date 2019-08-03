// eslint-disable-next-line no-unused-vars
const mongoose = require('mongoose');
const Campground = require('./models/campground');
const Comment = require('./models/comment');

const data = [
  {
    name: 'Sugarloaf Provincial Park',
    image:
      'https://images.unsplash.com/photo-1497900304864-273dfb3aae33?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=788&q=80',
    description:
      // eslint-disable-next-line max-len
      'A rainy weekend at the Sugarloaf Bike Park. It was a wet and muddy weekend, but still, a blast pumping through berms with mud filling everything.',
  },
  {
    name: 'Mountains',
    image:
      'https://images.unsplash.com/photo-1476041800959-2f6bb412c8ce?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=750&q=80',
    description: 'Camping in the mountains',
  },
  {
    name: 'Archer River',
    image:
      'https://images.unsplash.com/photo-1515408320194-59643816c5b2?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=750&q=80',
    description: 'Archer River Roadhouse, Archer River, Australia',
  },
];
/**
 *
 */
function seedDB() {
  // Remove all campgrounds
  Campground.remove({}, function(err) {
    if (err) {
      console.log(err);
    }
    console.log('removed campgrounds!');
    // Comment.remove({}, function(err) {
    //   if (err) {
    //     console.log(err);
    //   }
    //   console.log('removed comments!');
    //   // add a few campgrounds
    //   data.forEach(function(seed) {
    //     Campground.create(seed, function(err, campground) {
    //       if (err) {
    //         console.log(err);
    //       } else {
    //         console.log('added a campground');
    //         // create a comment
    //         Comment.create(
    //             {
    //               text: 'This place is great, but I wish there was internet',
    //               author: 'Homer',
    //             },
    //             function(err, comment) {
    //               if (err) {
    //                 console.log(err);
    //               } else {
    //                 campground.comments.push(comment);
    //                 campground.save();
    //                 console.log('Created new comment');
    //               }
    //             }
    //         );
    //       }
    //     });
    //   });
    // });
  });
}

module.exports = seedDB;
