const express = require('express');
const router = express.Router();

// Load models
const User = require('../models/user');
const Class = require('../models/class');

// Load student dashboard
router.get("/dashboard", function(req,res){
    res.render("student/dashboard");
});

// Load student class
router.get("/class/:cid", function(req,res){
    res.render("student/class");
});

module.exports = router;