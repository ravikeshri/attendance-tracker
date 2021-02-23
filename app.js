//requiring packages
      const express   = require("express"),
      app       = express(),
      bodyParser = require("body-parser"),
      methodOverride = require('method-override'),
      mongoose  = require("mongoose");
      const  bcrypt =require('bcrypt');
      const flash=require('connect-flash');
      const session=require('express-session');
      const passport = require('passport');
       //Passport config
       require('./config/passport') (passport);
   
      //DB CONFIG
     const db = require('./config/keys').MongoURI;

     //connect to mongo
        mongoose.connect(db, 
        {
         useNewUrlParser:true ,       
         useUnifiedTopology: true,
         useCreateIndex: true,
         useFindAndModify: false
})
    .then(() => console.log('MongoDB connected...'))
    .catch(err => console.log(err));

//model user
const User=require('./models/user');
    


//setup
app.set("view engine","ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride("_method"));

//express session
app.use(session({
    secret:'secret',
    resave:true,
    saveUninitialized:true
}));
//passport middleware
app.use(passport.initialize());
app.use(passport.session());

//connect flash
app.use(flash());

//global variable
app.use((req,res,next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
} );


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

app.get("/student/dashboard",function(req,res){
    res.render("student/dashboard");
})
app.get("/teacher/dashboard",function(req,res){
    res.render("teacher/dashboard");
})
app.post("/:user/register", (req, res)=> {
    console.log(req.body);
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
          console.log(errors);
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
                    if(isTeacher==true)
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
                    console.log(newUser);
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
          console.log(errors);
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
                    if(isTeacher==false)
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
      // if user is teacher
    
    // save user and redirect to teacher login
    // if user is student
    // save user and redirect to student login

});
 //login Handle
 app.post('/:user/login',(req,res,next) => {
    console.log(req.body);
    if(req.params.user=='student')
    {
 
    passport.authenticate('local' , {
      successRedirect:'/student/dashboard',
      failureRedirect:'/student/login',
      failureFlash:true
    })(req,res,next);
   }
   else
   {
    passport.authenticate('local' , {
        successRedirect:'/teacher/dashboard',
        failureRedirect:'/teacher/login',
        failureFlash:true
      })(req,res,next);
   }
});
  
  



 
// Server is running on port no 5000
app.listen(5000,function(){
    console.log("server is running...");
  });