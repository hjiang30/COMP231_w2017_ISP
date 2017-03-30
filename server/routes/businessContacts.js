


// modules required for routing
let express = require('express');
let router = express.Router();
let mongoose = require('mongoose');
let passport = require('passport');

// define the user model
let UserModel = require('../models/users');
let User = UserModel.User; // alias for User Model - User object

// define the businessContact model
let businessContact = require('../models/businessContacts');

// create a function to check if the user is authenticated
function requireAuth(req, res, next) {
  // check if the user is logged in
  if(!req.isAuthenticated()) {
    return res.redirect('/login');
  }
  next();
}

/* GET businessContacts List page. READ */
router.get('/', requireAuth, (req, res, next) => {
  // find all businessContacts in the businessContacts collection
  businessContact.find( (err, businessContacts) => {
    if (err) {
      return console.error(err);
    }
    else {
      res.render('businessContacts/index', {
        title: 'BusinessContacts',
        businessContacts: businessContacts,
        displayName: req.user.displayName
      });
    }
  });

});

//  GET the businessContact Details page in order to add a new businessContact
router.get('/add', requireAuth, (req, res, next) => {
  res.render('businessContacts/details', {
    title: "Add a contact",
    businessContacts: '',
    displayName: req.user.displayName
  });
});

// POST process the businessContact Details page and create a new businessContact - CREATE
router.post('/add', requireAuth, (req, res, next) => {

    let newBusinessContact = businessContact({
      "name": req.body.name,
      "email": req.body.email,
      "contact": req.body.contact
    });

    businessContact.create(newBusinessContact, (err, businessContact) => {
      if(err) {
        console.log(err);
        res.end(err);
      } else {
        res.redirect('/businessContacts');
      }
    });
});

// GET the businessContact Details page in order to edit a new businessContact
router.get('/:id', requireAuth, (req, res, next) => {

    try {
      // get a reference to the id from the url
      let id = mongoose.Types.ObjectId.createFromHexString(req.params.id);

        // find one businessContact by its id
      businessContact.findById(id, (err, businessContacts) => {
        if(err) {
          console.log(err);
          res.end(error);
        } else {
          // show the game details view
          res.render('businessContacts/details', {
              title: 'Business Conatact Details',
              businessContacts: businessContacts,
              displayName: req.user.displayName
          });
        }
      });
    } catch (err) {
      console.log(err);
      res.redirect('/errors/404');
    }
});

// POST - process the information passed from the details form and update the document
router.post('/:id', requireAuth, (req, res, next) => {
  // get a reference to the id from the url
    let id = req.params.id;

     let updatedBusinessContact = businessContact({
       "_id": id,
      "name": req.body.name,
      "email": req.body.email,
      "contact": req.body.contact
    });

    businessContact.update({_id: id}, updatedBusinessContact, (err) => {
      if(err) {
        console.log(err);
        res.end(err);
      } else {
        // refresh the businessContact List
        res.redirect('/businessContacts');
      }
    });

});

// GET - process the delete by user id
router.get('/delete/:id', requireAuth, (req, res, next) => {
  // get a reference to the id from the url
    let id = req.params.id;

    businessContact.remove({_id: id}, (err) => {
      if(err) {
        console.log(err);
        res.end(err);
      } else {
        // refresh the businessContacts list
        res.redirect('/businessContacts');
      }
    });
});


module.exports = router;