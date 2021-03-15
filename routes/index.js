const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');
const forwardAuthenticated = require('../config/auth').forwardAuthenticated;
const forwardAuthenticated2 = require('../config/auth2').forwardAuthenticated;

// Load User model
const User = require('../models/user');
const { ensureAuthenticated } = require('../config/auth2');

router.get("/", function(req, res) {
    // landing page yet to be created
    // res.render("landing");
    res.redirect("/student/login");
});

// load login pages
router.get("/student/login", forwardAuthenticated, function(req, res) {
    res.render("student/login");
});
router.get("/teacher/login", forwardAuthenticated2, function(req, res) {
    res.render("teacher/login");
});

// load register pages
router.get("/student/register", forwardAuthenticated, function(req, res) {
    res.render("student/register");
});
router.get("/teacher/register", forwardAuthenticated2, function(req, res) {
    res.render("teacher/register");
});

// post route to register user
router.post("/:user/register", forwardAuthenticated, (req, res)=> {
    // if user is teacher
    // save user and redirect to teacher login
    // if user is student
    // save user and redirect to student login
    
       if(req.params.user=='student')
       {
      const{name,username,password,password2,email,stream,department,phone}=req.body;
      let errors=[];
      //check required fields
      if(!name||!username||!password||!password2||!email||!stream||!department||!phone)
      {
          errors.push({msg:'please fill in all fields'});
      }
      if(password!=password2)
      {
          errors.push({msg:'Passwords do not match'});
      }
      //check pass length
      if(password.length<6)
      errors.push({msg:'password should be atleast 6 character'});
      
      if(errors.length>0)
      {
        //   console.log(errors);
        res.render(req.params.user+'/register',{
            errors,
            name,
            username,
            password,
            password2,
            email,
            stream,
            department,
            phone
        });
      }
      else
      {
          //Validation passed
            User.findOne({username:username})
            .then(user =>{
                if(user)
                {
                    
                    errors.push({msg:'username already exist'})
                    if(user.isTeacher==true)
                    {
                    res.render(req.params.user+'/register',{
                        errors,
                        name,
                        username,
                        password,
                        password2,
                        email,
                        stream,
                        department,
                        phone
                    })};             
                }else{

                    const newUser = new User({
                        name,
                        username,
                        password,
                        email,
                        isTeacher:false,
                        stream,
                        department,
                        phone
                    });
                   // console.log(newUser);
                    //hash password
                    bcrypt.genSalt(10,(err,salt) =>
                      bcrypt.hash(newUser.password,salt,(err,hash)=>
                    {
                      if(err) throw err;
                      //set password to hash
                      newUser.password=hash;
                      //save user
                      newUser.save()
                      .then(user =>{
                          req.flash('success_msg','You Are now registered and can log in');
                         res.redirect('/student/login')
                      })
                      .catch(err => console.log(err));
                    }))
                }
            })
      }
      
    }
    else
    {
        const{name,username,password,password2,email,department,phone}=req.body;
      let errors=[];
      //check required fields
      if(!name||!username||!password||!password2||!email||!department||!phone)
      {
          errors.push({msg:'please fill in all fields'});
      }
      if(password!=password2) 
      {
          errors.push({msg:'Passwords do not match'});
      }
      //check pass length
      /*if(password.length<6)
      errors.push({msg:'password should be atleast 6 character'});
      */
      if(errors.length>0)
      {
        //   console.log(errors);
        res.render(req.params.user+'/register',{
            errors,
            name,
            username,
            password,
            password2,
            email,
            //stream,
            department,
            phone
        });
      }
      else
      {
          //Validation passed
            User.findOne({username:username})
            .then(user =>{
                if(user)
                {
                    errors.push({msg:'username already exist'})
                    if(user.isTeacher==false)
                    {
                    res.render(req.params.user+'/register',{
                        errors,
                        name,
                        username,
                        password,
                        password2,
                        email,
                        //stream,
                        department,
                        phone
                    })};             
                }else{

                    const newUser = new User({
                        name,
                        username,
                        password,
                        email,
                        isTeacher:true,
                        stream:null,
                        department,
                        phone
                    });
                    //console.log(newUser);
                    //hash password
                    bcrypt.genSalt(10,(err,salt) =>
                      bcrypt.hash(newUser.password,salt,(err,hash)=>
                    {
                      if(err) throw err;
                      //set password to hash
                      newUser.password=hash;
                      //save user
                      newUser.save()
                      .then(user =>{
                          req.flash('success_msg','You Are now registered and can log in');
                         res.redirect('/teacher/login')
                      })
                      .catch(err => console.log (err));
                    }))
                }
            })
      }
      
    }
});

//login Handle
router.post('/:user/login', forwardAuthenticated, (req,res,next) => {
   // console.log(req.body);
    User.findOne({username: req.body.username}, function(err, user) {
        if(err) {
            console.log(err);
            res.redirect("/");
        } else {
            if(user.isTeacher && req.params.user=='teacher') {
                passport.authenticate('local' , {
                    successRedirect:'/teacher/dashboard',
                    failureRedirect:'/teacher/login',
                    failureFlash:true
                })(req,res,next);

            } else if(!user.isTeacher && req.params.user=='student') {
                passport.authenticate('local' , {
                    successRedirect:'/student/dashboard',
                    failureRedirect:'/student/login',
                    failureFlash:true
                })(req,res,next);

            } else {
                req.flash("error_msg", "Invalid username or password");
                res.redirect("back");
            }
        }
    });
});

// Logout route
// router.get("/user/logout", function(req, res) {
//     // logout user and redirect to "/"
  router.get('/user/logout', ensureAuthenticated, (req,res)=>{
      
    req.logout();
    req.flash('success_msg','you are logged out ');
    res.redirect("/student/login");
 });
  
// });

module.exports = router;