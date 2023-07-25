const User = require('../models/user.model');
const Customer = require('../models/customer.model');
const router = require('express').Router();
const { roles } = require('../utils/constants');
const { registerValidator } = require('../utils/validators');
const { body, validationResult } = require('express-validator');
const multer = require('multer')
const path = require('path');

//photo upload
const storage = multer.diskStorage({
  destination: function(req,file,cb){
    cb(null,'./uploads');
    },
    
    filename: (req, file, cb) => {
      cb(null, file.fieldname + '_' + Date.now())
  },
});

const upload= multer({storage: storage})

router.get('/customers', async (req, res, next) => {
  try {
    const customers = await Customer.find();
    // res.send(customers);
    res.render('micro-customers', { customers });
  } catch (error) {
    next(error);
  }
});

router.get(
  '/register-customer',
    async (req, res, next) => {
    res.render('register-customer');
  }
);

router.post(
  '/register-customer', upload.single("image"),
   registerValidator,
    async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        errors.array().forEach((error) => {
          req.flash('error', error.msg);
        });
        res.render('register-customer', {
          name: req.body.name,
          email: req.body.email,
          image: req.file.filename,
          password: req.body.password,
          startdate: req.body.startdate,
          messages: req.flash(),
        });
        return;
      }

      const { email } = req.body;
      const doesExist = await Customer.findOne({ email });
      const userdoesExist = await User.findOne({ email });
      if (doesExist || userdoesExist) {
        req.flash('warning', 'Username/email already exists');
        res.redirect('/retailer/register-customer');
        return;
      }
      console.log(req.file)
      if (req.file.mimetype !== 'image/png' && req.file.mimetype !=='image/jpg' && req.file.mimetype !== 'application/pdf' && req.file.mimetype !== 'image/jpeg') {
        req.flash('warning', 'Only Image/PDF allowed');
        res.redirect('/retailer/register-customer');
        return;
      } 
      if (req.file.size >  1000000 ) {
        req.flash('warning', 'File too large');
        res.redirect('/retailer/register-customer');
        return;
      }        
      const customer = new Customer({
        name: req.body.name,
        email: req.body.email,
        image: req.file.filename,
        password: req.body.password,
        startdate: req.body.startdate,
      });
      const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
      });
      await customer.save();
      await user.save();
      req.flash(
        'success',
        `${customer.email} registered succesfully, you can now login`
      );
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;