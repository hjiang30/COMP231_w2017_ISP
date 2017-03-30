

let mongoose = require('mongoose');

// create a model class
let businessContactSchema = mongoose.Schema({
    name: String,
    email: String,
    contact: Number
},
{
  collection: "businesscontacts"
});

module.exports = mongoose.model('businesscontacts', businessContactSchema);