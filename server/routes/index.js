

// modules required for routing
var express = require('express');
var router = express.Router();
var Client = require('node-rest-client').Client;
let mongoose = require('mongoose');
let passport = require('passport');
var client = new Client();
var plotly = require('plotly')("hjiang", "r9tQz4mMuPBW4q0IC3mx")


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
  data:'',
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


router.post('/select',(req,res,next)=>{

var choice = req.body.filter;

console.log(req.body.filter);

var args = {
    data: { 'f1':0,'f2':0,'f3':0,'f4':0},
    headers: { "Content-Type": "application/json" }
};

if (choice.length>0)
{
	if(choice.indexOf('f1') > -1)
	 args["data"]['f1']=1;	
	if(choice.indexOf('f2') > -1)
         args["data"]['f2']=1;
	 if(choice.indexOf('f3') > -1)
         args["data"]['f3']=1;
	 if(choice.indexOf('f4') > -1)
         args["data"]['f4']=1;


	
}
 
// 
client.post("http://127.0.0.1:8080/select", args, function (data, response) {
    // parsed response body as js object 
    //the data must be the jsonarray, such as [“GOOG”,”APPL”]
    //the display method is used for you to update the table   behind the filters, please implement it.at first, you can use mock data such as :
//let data = [“GOOG”,”APPL”]
  //  display(data);
console.log(data);
//var jsonContent = JSON.parse(data);
//console.log(jsonContent);
//console.log(jsonContent.length);
res.render('content/profile',{
      title: "Profile",
      //messages: req.flash('registerMessage'),
      data:makeData(data),
      displayName: req.user ? req.user.displayName : ''
    });


});



});




router.post('/simulate',(req,res,next)=>{
//console.log("simulate called!");
//console.log(req.body.startDate);
//console.log(req.body.endDate);
//console.log(req.body.capital);
//console.log(req.body.position);
//console.log(req.body.weight);
//res.redirect('/profile');

var choice = ['f1'];

//console.log(req.body.filter);

var args = {
    data: { 'f1':0,'f2':0,'f3':0,'f4':0},
    headers: { "Content-Type": "application/json" }
};

if (choice.length>0)
{
        if(choice.indexOf('f1') > -1)
         args["data"]['f1']=1;
        if(choice.indexOf('f2') > -1)
         args["data"]['f2']=1;
         if(choice.indexOf('f3') > -1)
         args["data"]['f3']=1;
         if(choice.indexOf('f4') > -1)
         args["data"]['f4']=1;



}

// 
client.post("http://127.0.0.1:8080/select", args, function (data, response) {
console.log(data);
//var jsonContent = JSON.parse(data);
//console.log(jsonContent);
//console.log(jsonContent.length);

var capital = parseFloat(req.body.capital);
var position = parseFloat(req.body.position);
var stock_capital = capital * position;
var cash_capital = capital - stock_capital;
console.log(data.length);
var each_capital = stock_capital/data.length;
var shares_dic = {}
var prices_info = getPrices(data);

var dates = ['2017-02-09', '2017-02-10', '2017-02-13', '2017-02-14', '2017-02-15', '2017-02-16', '2017-02-17', '2017-02-21', '2017-02-22', '2017-02-23', '2017-02-24', '2017-02-27', '2017-02-28', '2017-03-01', '2017-03-02', '2017-03-03', '2017-03-06', '2017-03-07', '2017-03-08', '2017-03-09', '2017-03-10', '2017-03-13', '2017-03-14', '2017-03-15', '2017-03-16', '2017-03-17', '2017-03-20', '2017-03-21', '2017-03-22', '2017-03-23', '2017-03-24', '2017-03-27', '2017-03-28', '2017-03-29', '2017-03-30', '2017-03-31', '2017-04-03', '2017-04-04', '2017-04-05', '2017-04-06', '2017-04-07', '2017-04-10'];

for (var i = 0; i < data.length; i++) {
    
    
}

res.render('content/profile',{
      title: "Profile",
      //messages: req.flash('registerMessage'),
      data:makeData(data),
      displayName: req.user ? req.user.displayName : ''
    });


});






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

function getPrices(symbols)
{
var dic = {};



}

function makeData(symbols) {
var dic = {};
dic.STO={symbol:"STO",name:"STATOIL ASA-ADR",price:"16.93",percentage:"0.53%"};
dic.XOM={symbol:"XOM",name:"EXXON MOBIL CORP",price:"81.67",percentage:"0.79%"};
dic.CVX={symbol:"CVX",name:"CHEVRON CORP",price:"110.04",percentage:"0.39%"};
dic.BP={symbol:"BP",name:"BP PLC-ADR",price:"33.50",percentage:"0.57%"};
dic.DHR={symbol:"DHR",name:"DANAHER CORP",price:"87.31",percentage:"0.80%"};
dic.BUD={symbol:"BUD",name:"ANHEUSER-SPN ADR",price:"106.81",percentage:"0.75%"};
dic.ABT={symbol:"ABT",name:"ABBOTT LABS",price:"45.63",percentage:"0.60%"};
dic.HAL={symbol:"HAL",name:"HALLIBURTON CO",price:"50.89",percentage:"-0.78%"};
dic.INTC={symbol:"INTC",name:"INTEL CORP",price:"35.82",percentage:"0.56%"};
dic.AMZN={symbol:"AMZN",name:"AMAZON.COM INC",price:"853.00",percentage:"0.29%"};
dic.DD={symbol:"DD",name:"DU PONT (EI)",price:"80.48",percentage:"0.89%"};
dic.KHC={symbol:"KHC",name:"KRAFT HEINZ CO/T",price:"91.53",percentage:"0.69%"};
dic.UL={symbol:"UL",name:"UNILEVER PLC-ADR",price:"48.62",percentage:"2.23%"};
dic.INFY={symbol:"INFY",name:"INFOSYS LTD-ADR",price:"15.22",percentage:"1.67%"};
dic.VOD={symbol:"VOD",name:"VODAFONE GRP-ADR",price:"25.19",percentage:"0.52%"};
dic.MMM={symbol:"MMM",name:"3M CO",price:"189.90",percentage:"0.21%"};
dic.FOX={symbol:"FOX",name:"TWENTY-FIRST - B",price:"30.08",percentage:"0.93%"};
dic.HDB={symbol:"HDB",name:"HDFC BANK-ADR",price:"71.43",percentage:"0.70%"};
dic.WBA={symbol:"WBA",name:"WALGREENS BOOTS",price:"85.31",percentage:"0.18%"};
dic.LLY={symbol:"LLY",name:"ELI LILLY & CO",price:"84.55",percentage:"1.37%"};
dic.RELX={symbol:"RELX",name:"RELX PLC - ADR",price:"19.04",percentage:"0.63%"};
dic.EOG={symbol:"EOG",name:"EOG RESOURCES",price:"95.70",percentage:"0.92%"};
dic.GSK={symbol:"GSK",name:"GLAXOSMITHKL-ADR",price:"41.45",percentage:"0.78%"};
dic.WBK={symbol:"WBK",name:"WESTPAC BANK-ADR",price:"26.34",percentage:"1.15%"};
dic.PUK={symbol:"PUK",name:"PRUDENTIAL-ADR",price:"40.24",percentage:"0.70%"};
dic.LMT={symbol:"LMT",name:"LOCKHEED MARTIN",price:"268.68",percentage:"0.36%"};
dic.CMCSA={symbol:"CMCSA",name:"COMCAST CORP-A",price:"37.38",percentage:"0.73%"};
dic.EPD={symbol:"EPD",name:"ENTERPRISE PRODU",price:"27.60",percentage:"-0.43%"};
dic.SLB={symbol:"SLB",name:"SCHLUMBERGER LTD",price:"78.70",percentage:"0.77%"};
dic.KMI={symbol:"KMI",name:"KINDER MORGAN IN",price:"21.27",percentage:"-0.09%"};
dic.TOT={symbol:"TOT",name:"TOTAL SA-SP ADR",price:"49.13",percentage:"1.18%"};
dic.MDLZ={symbol:"MDLZ",name:"MONDELEZ INTER-A",price:"43.80",percentage:"1.53%"};
dic.CELG={symbol:"CELG",name:"CELGENE CORP",price:"125.13",percentage:"1.70%"};
dic.ASML={symbol:"ASML",name:"ASML HOLDING-NY",price:"121.25",percentage:"0.41%"};
dic.SNP={symbol:"SNP",name:"CHINA PETRO-ADR",price:"75.81",percentage:"-1.10%"};
dic.COP={symbol:"COP",name:"CONOCOPHILLIPS",price:"46.48",percentage:"1.24%"};
dic.MCK={symbol:"MCK",name:"MCKESSON CORP",price:"149.47",percentage:"1.11%"};
dic.ORAN={symbol:"ORAN",name:"ORANGE-SPON ADR",price:"15.45",percentage:"2.52%"};
dic.GOOGL={symbol:"GOOGL",name:"ALPHABET INC-A",price:"857.84",percentage:"0.49%"};
dic.NVS={symbol:"NVS",name:"NOVARTIS AG-ADR",price:"75.11",percentage:"1.14%"};
dic.MTU={symbol:"MTU",name:"MITSUBISHI U-ADR",price:"6.64",percentage:"0.76%"};
dic.OXY={symbol:"OXY",name:"OCCIDENTAL PETE",price:"62.50",percentage:"0.71%"};
dic.UTX={symbol:"UTX",name:"UNITED TECH CORP",price:"111.93",percentage:"0.16%"};
dic.NGG={symbol:"NGG",name:"NATIONAL GRI-ADR",price:"59.66",percentage:"0.24%"};
dic.GIS={symbol:"GIS",name:"GENERAL MILLS IN",price:"60.63",percentage:"0.93%"};
dic.SAP={symbol:"SAP",name:"SAP SE-SPONS ADR",price:"94.57",percentage:"0.41%"};
dic.AVGO={symbol:"AVGO",name:"BROADCOM LTD",price:"222.01",percentage:"1.08%"};
dic.IBM={symbol:"IBM",name:"IBM",price:"177.18",percentage:"-1.26%"};
dic.SO={symbol:"SO",name:"SOUTHERN CO",price:"49.50",percentage:"-0.54%"};
dic.TJX={symbol:"TJX",name:"TJX COS INC",price:"77.94",percentage:"-0.65%"};
dic.UNP={symbol:"UNP",name:"UNION PAC CORP",price:"106.18",percentage:"-0.50%"};
dic.GE={symbol:"GE",name:"GENERAL ELECTRIC",price:"29.66",percentage:"-0.47%"};
dic.SNP={symbol:"SNP",name:"CHINA PETRO-ADR",price:"75.81",percentage:"-1.10%"};
dic.NEE={symbol:"NEE",name:"NEXTERA ENERGY",price:"128.75",percentage:"-0.53%"};
dic.MFG={symbol:"MFG",name:"MIZUHO FINAN-ADR",price:"3.70",percentage:"-0.54%"};
dic.GILD={symbol:"GILD",name:"GILEAD SCIENCES",price:"67.87",percentage:"-1.88%"};
dic.CHA={symbol:"CHA",name:"CHINA TELECO-ADR",price:"46.21",percentage:"0.26%"};
dic.PTR={symbol:"PTR",name:"PETROCHINA -ADR",price:"73.69",percentage:"-0.55%"};
dic.TEVA={symbol:"TEVA",name:"TEVA PHARM-ADR",price:"32.96",percentage:"0.40%"};
dic.OXY={symbol:"OXY",name:"OCCIDENTAL PETE",price:"62.50",percentage:"0.71%"};
dic.FOX={symbol:"FOX",name:"TWENTY-FIRST - B",price:"30.08",percentage:"0.93%"};
dic.ORAN={symbol:"ORAN",name:"ORANGE-SPON ADR",price:"15.45",percentage:"2.52%"};



var result = []

for (var key in dic) {
    var value = dic[key];
    if (symbols.indexOf(key) > -1) {
    result.push(value);
	}
    // Use `key` and `value`
}
//result.push(dict.STO);
//dict.key2 = "value2";


  return result;
}


module.exports = router;
