const express = require('express');
const router = express.Router();
const {ensureAuthenticated} = require('../config/auth2');
// Load models
const User = require('../models/user');
const Class = require('../models/class');

// Load teacher dashboard
router.get("/dashboard",ensureAuthenticated, function(req,res){
    res.render("teacher/dashboard");
});

// POST route to create new class
router.post("/class/new", function(req, res) {
    // find the current user in User Model (req.user._id)
    // if he is teacher
    // then create class in Class model (req.body) 
    // add this newly created class to teacher's class list
    // put user id in class.teacher
    // then redirect to /teacher/dashboard, {success_msg: "Class"}
    // with a success msg
    User.findById(req.user._id, function(err, user) {
        if(err) {
            console.log(err);
            res.redirect("/teacher/dashboard");
        } else {
            if(user.isTeacher) {
                var new_class = {
                    name: req.body.name,
                    code: req.body.code,
                    stream: req.body.stream,
                    department: req.body.department,
                    teacher: user._id
                };

                Class.create(new_class, function(err, cls){
                    if(err) {
                        console.log(err);
                        res.redirect("/teacher/dashboard");
                    }
                    else {
                        user.classes.push(cls._id);
                        Class.save();
                        User.save();
                        res.redirect("/teacher/dashboard", {success_msg: "Class Created"});
                    }
                });

            }
        }
    }); 

});

// Load teacher class
router.get("/class/:cid", function(req,res){
    res.render("teacher/class");
});

module.exports = router;