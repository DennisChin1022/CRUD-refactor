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
        brandname: req.body.brandname,
        modelname: req.body.modelname,
        modelcode: req.body.modelcode,
        description: req.body.description,
        serialnumber: req.body.serialnumber,
        cardnumber: req.body.cardnumber,
        price: req.body.price,
        date: req.body.date,
        vipnumber: req.body.vipnumber,
        name: req.body.name,
        gender: req.body.gender,
        dob: req.body.dob,
        email: req.body.email,
        phone: req.body.phone,
        address: req.body.address,
        image: req.file.filename,
      });
      await customer.save();
      req.flash(
        'success',
        `${customer.email} Createed succesfully, you can view it in All Customer`
      );
    } catch (error) {
      next(error);
    }
  }
);

router.get(
  '/customer/:id',
    async (req, res, next) => {
      try {
        const { id } = req.params;
        const customer = await Customer.findById(id);
        res.render('customer-info', { customer });
        const html = fs.readFileSync(path.join(__dirname, '../views/template.html'), 'utf-8');
        const filename = Math.random() + '_doc' + '.pdf';
        
      } catch (error) {
        next(error);
      }
   
  }
);



module.exports = router;