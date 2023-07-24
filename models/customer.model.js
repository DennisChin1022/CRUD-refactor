const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const createHttpError = require('http-errors');
const { roles } = require('../utils/constants');

const CustomerSchema = new mongoose.Schema({
  name:{
    type: String,
    required: true,
  },
    email: {
    type: String,
    required: true,
    lowercase: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: [roles.client],
    default: roles.client,
  },
  image:{
    type: String
  },
  startdate:{
    type: Date,
  },
});

const Customer = mongoose.model('customer', CustomerSchema);
module.exports = Customer;