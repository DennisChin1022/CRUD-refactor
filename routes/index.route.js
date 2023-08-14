const router = require('express').Router();
const Customer = require('../models/customer.model');
const axios = require('axios');


router.get('/', (req, res, next) => {
  res.render('index');
});

router.post('/', async (req, res, next) => {
  try {
    const {serialnumber}  = req.body;
    console.log(req.body)
    const serialnumbers = await axios.get('http://18.138.197.252:801/ORBT?requestType=getAlias&aliasName=' + serialnumber);
    console.log(serialnumbers.data.aliasName)
    if (serialnumbers.data.aliasName === req.body.serialnumber) {
      req.flash('warning', 'Serial Number is Valid');
        res.redirect('/');
    }
    req.flash('warning', 'Serial Number Not Valid');
    res.redirect('/');
  } catch (error) {
    next(error);
  }
});

// axios.get('http://18.138.197.252:801/ORBT?requestType=getAlias&aliasName=rolex123456')
// .then(result => {
//   console.log(result.data.aliasName);
// })
// .catch(error => {
//   console.log(error);
// });

module.exports = router;