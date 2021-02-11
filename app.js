//requiring packages
const express   = require("express"),
      app       = express(),
      bodyParser = require("body-parser"),
      methodOverride = require('method-override'),
      mongoose  = require("mongoose");

//setup
app.set("view engine","ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride("_method"));

app.get("/", function(req, res) {
    // landing page yet to be created
    // res.render("landing");
    res.redirect("/student/login");
});

app.get("/student/login", function(req, res) {
    res.render("student/login");
});

app.get("/teacher/login", function(req, res) {
    res.render("teacher/login");
});

app.get("/student/register", function(req, res) {
    res.render("student/register");
});

app.get("/teacher/register", function(req, res) {
    res.render("teacher/register");
});

app.post("/:user/register", function(req, res) {
    // if user is teacher
    // save user and redirect to teacher login
    // if user is student
    // save user and redirect to student login

});

// Server is running on port no 5000
app.listen(5000,function(){
    console.log("server is running...");
  });