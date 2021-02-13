//requiring packages
const express   = require("express"),
      app       = express(),
      bodyParser = require("body-parser"),
      methodOverride = require('method-override'),
      mongoose  = require("mongoose");

    //DB CONFIG
    const db = require('./config/keys').MongoURI;

    //connect to mongo
    mongoose.connect(db, 
        {useNewUrlParser:true ,       
         useUnifiedTopology: true,
        useCreateIndex: true,
        useFindAndModify: false
})
    .then(() => console.log('MongoDB connected...'))
    .catch(err => console.log(err));

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

app.post(":user/register", (req, res)=> {
       if(student)
       {
      const{name,username,password,password2,email,stream,department,phone}=req.body;
      let error=[];
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
        res.render('register',{
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
          res.send('pass');
      }
      
    }
      // if user is teacher
    
    // save user and redirect to teacher login
    // if user is student
    // save user and redirect to student login

});
 
// Server is running on port no 5000
app.listen(5000,function(){
    console.log("server is running...");
  });