

// modules required for routing
var express = require('express');
var router = express.Router();
var Client = require('node-rest-client').Client;
let mongoose = require('mongoose');
let passport = require('passport');
var client = new Client();


// define the user model
let UserModel = require('../models/users');
let User = UserModel.User; // alias for User Model - User object

// create a function to check if the user is authenticated
function requireAuth(req, res, next) {
  // check if the user is logged in
  if(!req.isAuthenticated()) {
    return res.redirect('/login');
  }
  next();
}

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('content/index', { 
    title: 'Home',
    displayName: req.user ? req.user.displayName : ''
  });
});

/* GET aboutUs page. */
router.get('/aboutUs', function(req, res, next)
{
 res.render('content/aboutUs',{
   title: 'AboutUs',
   displayName: req.user ? req.user.displayName : ''
  });
});


/* GET projects page */
router.get('/profile',requireAuth, function(req, res, next)
{
res.render('content/profile', {
  title: 'Profile',
  displayName: req.user ? req.user.displayName : ''
});
});


// GET /login - render the login view
router.get('/login', (req, res, next)=>{
  // check to see if the user is not already logged in
  if(!req.user) {
    // render the login page
    res.render('auth/login', {
      title: "Login",
      messages: req.flash('loginMessage'),
      displayName: req.user ? req.user.displayName : ''
    });
    return;
  } else {
    return res.redirect('/'); // redirect to businessContacts list
  }
});

// POST /login - process the login attempt
router.post('/login', passport.authenticate('local', {
  successRedirect: '/profile',
  failureRedirect: '/login',
  failureFlash: 'bad login'
}));

// GET /register - render the registration view
router.get('/register', (req, res, next)=>{
   // check to see if the user is not already logged in
  if(!req.user) {
    // render the registration page
      res.render('auth/register', {
      title: "Register",
      messages: req.flash('registerMessage'),
      displayName: req.user ? req.user.displayName : ''
    });
    return;
  } else {
    return res.redirect('/'); 
  }
});

// POST / register - process the registration submission
router.post('/register', (req, res, next)=>{
  User.register(
    new User({
      username: req.body.username,
      //password: req.body.password,
      email: req.body.email,
      displayName: req.body.displayName
    }),
    req.body.password,
    (err) => {
      if(err) {
        console.log('Error inserting new user');
        if(err.name == "UserExistsError") {
          req.flash('registerMessage', 'Registration Error: User Already Exists');
        }
        return res.render('auth/register', {
          title: "Register",
          messages: req.flash('registerMessage'),
          displayName: req.user ? req.user.displayName : ''
        });
      }
      // if registration is successful
      return passport.authenticate('local')(req, res, ()=>{
        res.redirect('/profile');
      });
    });
});

// GET /logout - process the logout request
router.get('/logout', (req, res, next)=>{
  req.logout();
  res.redirect('/'); // redirect to the home page
});

router.post('/simulate',(req,res,next)=>{
console.log("simulate called!");
console.log(req.body.startDate);
console.log(req.body.endDate);
console.log(req.body.capital);
console.log(req.body.position);
console.log(req.body.weight);
res.redirect('/profile');

});



//var args = {
   // dta: {"f1":1,"f2":0,"f3":0,"f4":1},
    //headers: { "Content-Type": "application/json" }
//};

//router.post("http://127.0.0.1:8080/select", args, function (dta, response){
// set content-type header and data as json in args parameter 

//Console.log("connection establised")
// parsed response body as js object 
    //the data must be the jsonarray, such as [“GOOG”,”APPL”]
    //the display method is used for you to update the table   behind the filters, please implement it.at first, you can use mock data such as :
   //let data = ["GOOG","APPL"]
  // display(data);

//});


module.exports = router;
