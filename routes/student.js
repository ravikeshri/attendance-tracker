const express = require('express');
const router = express.Router();
const {ensureAuthenticated} = require('../config/auth');

// Load models
const User = require('../models/user');
const Class = require('../models/class');

// Load student dashboard
router.get("/dashboard", ensureAuthenticated,function(req,res){
    //res.render("student/dashboard");
    // check if current user is teacher
    // then find his all class and load dashboard
    if(req.user.isTeacher) {
        Class.find().where('_id').in(req.user.classes).exec((err, classes) => {
            if(err) {
                console.log(err);
                 req.logout();
                res.redirect("/student/login");
            } else {
                res.render("student/dashboard", {classes: classes, user: req.user});
            }
        });
    } else {
        req.logout();
        req.flash("error_msg", "Invalid Username or Password!");
        res.render("student/login");
    }
});

// Load student class
router.get("/class/:cid", ensureAuthenticated, function(req,res){
    res.render("student/class");
});

// new class join
router.post("/class/join", ensureAuthenticated, function(req,res) {
    // req.body.code
    // find the class by code (id)
    // add student to the class and add class to student's class list
    // i)  cls.students.push ({id: req.user, attendance: []})
    // ii) req.user.classes.push(req.body.code)

});

module.exports = router;