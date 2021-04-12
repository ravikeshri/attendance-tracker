const express = require('express');
const router = express.Router();
const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth2');
// Load models
const User = require('../models/user');
const Class = require('../models/class');
const { route } = require('./student');

// Load teacher dashboard
router.get("/dashboard", ensureAuthenticated, function (req, res) {
    // check if current user is teacher
    // then find his all class and load dashboard
    if (req.user.isTeacher) {
        Class.find().where('_id').in(req.user.classes).exec((err, classes) => {
            if (err) {
                console.log(err);
                req.logout();
                res.redirect("/teacher/login");
            } else {
                res.render("teacher/dashboard", { classes: classes, user: req.user });
            }
        });
    } else {
        req.logout();
        req.flash("error_msg", "Invalid Username or Password!");
        res.render("teacher/login");
    }
});

// POST route to create new class
router.post("/class/new", ensureAuthenticated, function (req, res) {
    // find the current user in User Model (req.user._id)
    // if he is teacher
    // then create class in Class model (req.body) 
    // add this newly created class to teacher's class list
    // put user id in class.teacher
    // then redirect to /teacher/dashboard, {success_msg: "Class"}
    // with a success msg
    User.findById(req.user._id, function (err, user) {
        if (err) {
            console.log(err);
            res.redirect("/teacher/dashboard");
        } else {
            if (user.isTeacher) {
                var new_class = {
                    name: req.body.name,
                    code: req.body.code,
                    stream: req.body.stream,
                    department: req.body.department,
                    teacher: user._id
                };

                Class.create(new_class, function (err, cls) {
                    if (err) {
                        console.log(err);
                        res.redirect("/teacher/dashboard");
                    }
                    else {
                        user.classes.push(cls._id);
                        cls.save();
                        user.save();
                        req.flash("success_msg", "Class Created");
                        res.redirect("/teacher/dashboard");
                    }
                });

            }
        }
    });

});

// Load teacher class
router.get("/class/:cid", ensureAuthenticated, function (req, res) {
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
                    // load class with following data 
                    // (1) students info : name, registrationNo, email, department, stream, phone, attendance
                    // (2) class info : cls
                    // (3) teacher info : teacher
                    // (4) current logged in user : user (here teacher itself is current logged in user)

                    var students = [];
                    cls.students.forEach(student => {
                        var att = student.attendance.length / cls.dates.length;
                        User.findById(student.id, function (err, student) {
                            if (err) {
                                console.log(err);
                                res.redirect("/teacher/dashboard");
                            } else {
                                var temp = {
                                    id: student._id,
                                    name: student.name,
                                    regd: student.username,
                                    email: student.email,
                                    department: student.department,
                                    stream: student.stream,
                                    phone: student.phone,
                                    attendance: att
                                };
                                students.push(temp);
                            }
                        });
                    });
                    res.render("teacher/class", { students: students, cls: cls, teacher: teacher, user: req.user });
                }
            });
        }
    });
});

router.put("/class/:cid/edit", function (req, res) {

    // if current user is teacher (req.user)
    // find class by class id
    // Class.findByIdAndUpdate(req.params.cid, fun(err, cls))
    // cls.name = req.body.name , code, stream, department and then cls.save()
    // redirect to same class
    if (req.user.isTeacher) {
        Class.findById(req.params.cid, function (err, cls) {
            if (err) {
                console.log(err);
                res.redirect("/teacher/class/" + req.params.cid);
            }
            else {
                var check = true;
                if (!req.body.name || !req.body.code || !req.body.stream || !req.body.department)
                    check = false;
                if (check) {
                    cls.name = req.body.name;
                    cls.code = req.body.code;
                    cls.stream = req.body.stream;
                    cls.department = req.body.department;
                    cls.save();
                    res.redirect("/teacher/class/" + req.params.cid);
                }


            }
        })
    }

});
//delete route to delete class 
router.delete("/class/:cid/delete", function (req, res) {
    if (req.user.isTeacher) {

        Class.findByIdAndRemove(req.params.cid, function (err, cls) {
            if (err) {
                console.log(err);
                res.redirect("/teacher/dashboard");
            }
            else {
                var stu = cls.students;
                for (var i = 0; i < stu.length; i++) {

                    User.findById(stu[i].id, function (err, user) {
                        var ind = user.classes.findIndex(function (val) {
                            return val == req.params.cid;
                        })
                        user.classes.splice(ind, 1);
                        user.save();
                    })

                }
                var ind = req.user.classes.findIndex(function (val) {
                    return val == req.params.cid;
                })
                req.user.classes.splice(ind, 1);
                req.user.save();
                res.redirect("/teacher/dashboard");
            }
        })
    }


})
module.exports = router;