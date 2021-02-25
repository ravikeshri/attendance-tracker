//requiring packages
const express       = require("express"),
    app             = express(),
    bodyParser      = require("body-parser"),
    methodOverride  = require('method-override'),
    mongoose        = require("mongoose"),
    bcrypt          = require('bcrypt'),
    flash           = require('connect-flash'),
    session         = require('express-session'),
    passport        = require('passport');

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
    secret: 'secret',
    resave: true,
    saveUninitialized: true
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

// Login and Signup routes
app.use('/', require('./routes/index.js'));

// Teacher routes
app.use('/teacher', require('./routes/teacher.js'));

// Student routes
app.use('/student', require('./routes/student.js'));
  
 
// Server is running on port no 5000
app.listen(5000,function(){
    console.log("server is running...");
  });