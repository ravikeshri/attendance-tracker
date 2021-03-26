const express = require('express');
const router = express.Router();
const {ensureAuthenticated} = require('../config/auth');

// Load models
const User = require('../models/user');
const Class = require('../models/class');

// Load student dashboard
router.get("/dashboard", ensureAuthenticated,function(req,res){
    res.render("student/dashboard");
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