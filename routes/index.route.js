const router = require('express').Router();
const Customer = require('../models/customer.model');
const axios = require('axios');


router.get('/', (req, res, next) => {
  res.render('index');
});

router.post('/', async (req, res, next) => {
  //get the serial number key in web app
  try {
    const {serialnumber1}  = req.body;
    //make a request to ORBITIC blockchain for alias name as serial number
    const serialnumbers = await axios.get('http://18.138.197.252:801/ORBT?requestType=getAlias&aliasName=' + serialnumber1);
    console.log(serialnumbers.data.aliasName)
    //comparing if the serial number is valid
    if (serialnumbers.data.aliasName === serialnumber1) {
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