const mongoose = require('mongoose');

const CustomerSchema = new mongoose.Schema({
  brandname:{
    type: String,
    required: true,
  },
  modelname:{
    type: String,
  },
  modelcode:{
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  serialnumber:{
    type: String,
    required: true,
    lowercase: true,
    unique: true,
  },
  cardnumber:{
    type: String,
    required: true,
  },
  price:{
    type: String,
    required: true,
  },
  date:{
    type: String,
    required: true,
  },
  vipnumber:{
    type: String,
    required: true,
  },
  name:{
    type: String,
    required: true,
  },
  gender: {
    type: String,
    required: true,
  },
  dob:{
    type: String,
    required: true,
  },
  email:{
    type: String,
    required: true,
  },
  phone:{
    type: String,
    required: true,
  },
  address:{
    type: String,
  },
  image:{
    type: String,
    required: true,
  },
});

const Customer = mongoose.model('customer', CustomerSchema);
module.exports = Customer;