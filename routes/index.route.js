const router = require('express').Router();
const Customer = require('../models/customer.model');
const axios = require('axios');


// router.get('/', (req, res, next) => {
//   res.render('index');
// });

// router.get('/watchdata', async (req, res, next) => {
//   try {
//     const {serialnumber} = req.body;
//     const serialnumbers = await axios.get('http://18.138.197.252:801/ORBT?requestType=getAlias&aliasName=' + serialnumber);
//     const watchaccount = await axios.get('http://18.138.197.252:801/ORBT?requestType=getAsset&asset=' + serialnumbers.data.aliasURI);
//     res.render('watchdata', { watchaccount });
//   } catch (error) {
//     next(error);
//   }
// });

router.get('/', async (req, res, next) => {
  try {
    const {serialnumber} = req.body;
    const serialnumbers = await axios.get('http://18.138.197.252:801/ORBT?requestType=getAlias&aliasName=' + serialnumber);
    const watchaccount = await axios.get('http://18.138.197.252:801/ORBT?requestType=getAsset&asset=' + serialnumbers.data.aliasURI);
    const data = watchaccount.data.description
    
    if (data){
      const description = data.split(',')
      res.render('index', { watchaccount, description });
    }
    else {
      const description = 0
      res.render('index', { watchaccount, description });
    }
    
  } catch (error) {
    next(error);
  }
});

router.post('/', async (req, res, next) => {
  try {
    const {serialnumber} = req.body;
    console.log(req.body)
    const serialnumbers = await axios.get('http://18.138.197.252:801/ORBT?requestType=getAlias&aliasName=' + serialnumber);
    console.log(serialnumbers.data)
    if (serialnumbers.data.aliasURI && serialnumbers.data.accountRS ) {
      // const {aliasuri} = serialnumbers.data.aliasURI;
      const watchaccount = await axios.get('http://18.138.197.252:801/ORBT?requestType=getAsset&asset=' + serialnumbers.data.aliasURI);
      console.log(watchaccount.data)
      // let description = []
      const data = watchaccount.data.description
      const description = data.split(',')
      // for(const test of description){
      //   console.log(test)
      // }
      // console.log(test[6])
      console.log(description[2])
      res.render('index', { watchaccount, description });
      
    }else{
    req.flash('warning', 'Serial Number Not Valid');
    res.redirect('/');}
    
  } catch (error) {
    next(error);
  }
});

// router.post('/', async (req, res, next) => {
//   try {
//     const {serialnumber} = req.body;
//     console.log(req.body)
//     const serialnumbers = await axios.get('http://18.138.197.252:801/ORBT?requestType=getAlias&aliasName=' + serialnumber);
//     console.log(serialnumbers.data)
//     if (serialnumbers.data.aliasURI && serialnumbers.data.accountRS ) {
//       // const {aliasuri} = serialnumbers.data.aliasURI;
//       console.log(serialnumbers.data.aliasURI)
//       console.log(serialnumbers.data.accountRS)
//       const watchaccount = await axios.get('http://18.138.197.252:801/ORBT?requestType=getAsset&asset=' + serialnumbers.data.aliasURI);
//       console.log(watchaccount.data)
//       res.redirect('/watchdata');
//     }else{
//     req.flash('warning', 'Serial Number Not Valid');
//     res.redirect('/');}
    
//   } catch (error) {
//     next(error);
//   }
// });

// axios.get('http://18.138.197.252:801/ORBT?requestType=getAlias&aliasName=rolex123456')
// .then(result => {
//   console.log(result.data.aliasName);
// })
// .catch(error => {
//   console.log(error);
// });

module.exports = router;