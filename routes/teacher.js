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
// router.post("/class/new", function(req, res) {
//     // find the current user in User Model (req.user._id)
//     // if he is teacher
//     // then create class in Class model (req.body) 
//     // add this newly created class to teacher's class list
//     // put user id in class.teacher
//     // then redirect to /teacher/dashboard, {success_msg: "Class"}
//     // with a success msg


// });

// Load teacher class
router.get("/class/:cid", function(req,res){
    res.render("teacher/class");
});

module.exports = router;