# yelpcamp
>Web page developed with MongoDB, Express, Bootstrap and NodeJS

This is a project made by me in [The Web Developer Bootcamp](https://www.udemy.com/the-web-developer-bootcamp/) course, teached by Colt Steele.

Basically, is a web page where you can add campground posts (previous registration), indicating a title, image URL, and description.  
Each campground show page has a comments section, where anyone (previous registration) can post a comment.  
Authentication and authorization are needed for posting/editing/deleting campgrounds and comments.

## Build Info

- **Bootstrap 4** - FrontEnd Design
- **NodeJS** - Backend Runtime Environment
- **ExpressJS** - Backend Framework
- **MongoDB** - Distributed Database

## NPM Packages Used

- **body-parser**
- **ejs**
- **eslint**
- **express-session**
- **method-override**
- **mongoose**
- **passport**
- **passport-local**
- **passport-local-mongoose**

## RESTful routing
>This web page is made with RESTful routes

### **Campgrounds routing**

| NAME    | PATH                  | HTTP verb | PURPOSE                                                       | MongoDB Method                 |
| ------- | --------------------- | --------- | ------------------------------------------------------------- | ------------------------------ |
| INDEX   | /campgrounds          | GET       | Display a list of all campgrounds                             | Campground.find()              |
| NEW     | /campgrounds/new      | GET       | Displays a form to make a new campground                      | NA                             |
| CREATE  | /campgrounds          | POST      | Add a new campground to DB, then _redirect_ somewhere         | Campground.create()            |
| SHOW    | /campgrounds/:id      | GET       | Shows info about **one** specifig campground                  | Campground.findById()          |
| EDIT    | /campgrounds/:id/edit | GET       | Show edit form for **one** campground                         | Campground.findById()          |
| UPDATE  | /campgrounds/:id      | PUT       | Update a **particular** campground, then _redirect_ somewhere | Campground.findByIdAndUpdate() |
| DESTROY | /campgrounds/:id      | DELETE    | Delete a **particular** campground, then _redirect_ somewhere | Campground.findByIdAndRemove() |

## Authentication

- Prevent an unauthenticated user from creating a campground
- Save username + id to newly created campground
- Prevent a user from adding a comment if not signed in
- Associated users and comments
- Saved author's name to a comment automatically

## Authorization

- Users can only edit his/her campgrounds
- Users can only delete his/her campgrounds
- Hide/Show edit and delete buttons
