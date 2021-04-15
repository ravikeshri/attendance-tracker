const express = require('express');
const router = express.Router();
const {ensureAuthenticated} = require('../config/auth');

// Load models
const User = require('../models/user');
const Class = require('../models/class');

// Load student dashboard
router.get("/dashboard", ensureAuthenticated,function(req,res){
    // res.render("student/dashboard");
    // check if current user is student
    // then find his all class and load dashboard
    if(!req.user.isTeacher) {
        Class.find().where('_id').in(req.user.classes).exec((err, classes) => {
            if(err) {
                console.log(err);
                req.logout();
                res.redirect("/student/login");
            } else {
                var classData = [];
                classes.forEach(cls => {
                    for(var i=0; i<cls.students.length; i++) {
                        if(req.user._id.equals(cls.students[i].id)) {
                            var att = 0;
                            
                            if(cls.dates.length != 0) {
                                att = cls.students[i].attendance.length / cls.dates.length;
                            }
                            classData.push({cls: cls, att: Number(att)*100});
                            break;
                        }
                    }
                });
                res.render("student/dashboard", {classes: classData, user: req.user});
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
    // find the class
    // and load the class with all details
    Class.findById(req.params.cid, function (err, cls) {
        if (err) {
            console.log(err);
            res.redirect("/teacher/dashboard");
        } else {
            User.findById(cls.teacher, function (err, teacher) {
                if (err) {
                    console.log(err);
                    res.redirect("/teacher/dashboard");
                } else {
                    var stu = cls.students.find(function(val){ return req.user._id.equals(val.id)} );
                    var student = req.user;
                    student.attendance = stu.attendance;
                    student.regd = student.username;
                    student.percentage = (cls.dates.length == 0) ? 0 : (student.attendance.length / cls.dates.length)*100;
                    delete student.username;
                    delete student.password;
                    cls.dates.sort(function(a,b) {
                        var x = new Date(a);
                        var y = new Date(b);
                        return x.getTime() - y.getTime();
                    });
                    res.render("student/class", {cls: cls, student: student, teacher: teacher, user: req.user});
                }
            });
        }
    });
});

// new class join
router.post("/class/join", ensureAuthenticated, function(req,res) {
    // req.body.code
    // find the class by code (id)
    // add student to the class and add class to student's class list
    // i)  cls.students.push ({id: req.user, attendance: []})
    // ii) req.user.classes.push(req.body.code)
    Class.findById(req.body.code, function(err, cls) {
        if(err) {
            console.log(err);
        } else {
            var check = true;
            for(var i=0; i<cls.students.length; i++) {
                if(req.user._id.equals(cls.students[i].id)) {
                    check = false;
                    break;
                }
            }
            if(check) {
                cls.students.push({id: req.user, attendance: []});
                req.user.classes.push(req.body.code);
                cls.save();
                req.user.save();
                // res.redirect("/student/dashboard");
                res.redirect("/student/class/" + req.body.code);
            } else {
                req.flash('error_msg', 'Already Joined');
                res.redirect('/student/dashboard');
            }
        }
    });
});

module.exports = router;