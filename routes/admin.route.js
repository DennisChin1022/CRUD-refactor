const User = require('../models/user.model');
const Customer = require('../models/customer.model');
const router = require('express').Router();
const mongoose = require('mongoose');
const { roles } = require('../utils/constants');
const { registerValidator } = require('../utils/validators');
const { body, validationResult } = require('express-validator');
const multer = require('multer')

const storage = multer.diskStorage({
  destination: function(req,file,cb){
    cb(null,'./uploads');
    },
    filename: (req, file, cb) => {
      cb(null, file.fieldname + '_' + Date.now())
  },
});

const upload= multer({storage: storage})

router.get('/users', async (req, res, next) => {
  try {
    const users = await User.find();
    // res.send(users);
    res.render('manage-users', { users });
  } catch (error) {
    next(error);
  }
});


router.get('/update-user/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    res.render('update-user', { user });
  } catch (error) {
    next(error);
  }
});


router.post('/update-user', async (req, res, next) => {
  try {
    const {id, role} = req.body;

    // Checking for id and roles in req.body
    if (!id) {
      req.flash('error', 'Invalid request');
      return res.redirect('back');
    }

    // Check for valid mongoose objectID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      req.flash('error', 'Invalid id');
      return res.redirect('back');
    }

    // Check for Valid role
    const rolesArray = Object.values(roles);
    if (!rolesArray.includes(role)) {
      req.flash('error', 'Invalid role');
      return res.redirect('back');
    }

    // Finally update the user
    const user = await User.findByIdAndUpdate(id, req.body);
    req.flash('info', `updated data for ${user.email}`);
    res.redirect('back');
  } catch (error) {
    next(error);
  }
});

router.get('/delete-user/:id', async (req, res, next) => {
  try {
    // const {id} = req.params.id;
    // Check for valid mongoose objectID
        // Finally update the user
    const user = await User.findByIdAndDelete(req.params.id);
    req.flash('info', `deleted data for ${user.email}`);
    res.redirect('back');
  } catch (error) {
    next(error);
  }
});

router.get(
  '/register-retailer',
    async (req, res, next) => {
    res.render('register-retailer');
  }
);

router.post(
  '/register-retailer',
   registerValidator,
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        errors.array().forEach((error) => {
          req.flash('error', error.msg);
        });
        res.render('register-retailer', {
          name: req.body.name,
          phone: req.body.phone,
          address: req.body.address,
          email: req.body.email,
          messages: req.flash(),
        });
        return;
      }

      const { email } = req.body;
      const doesExist = await User.findOne({ email });
      if (doesExist) {
        req.flash('warning', 'Username/email already exists');
        res.redirect('/admin/register-retailer');
        return;
      }
      const user = new User(req.body);
      await user.save();
      req.flash(
        'success',
        `${user.email} registered succesfully, you can now login`
      );
    } catch (error) {
      next(error);
    }
  }
);

//-------------------------------------------customer--------------------------------------//
router.get('/customers', async (req, res, next) => {
  try {
    const customers = await Customer.find();
    // res.send(customers);
    res.render('manage-customers', { customers });
  } catch (error) {
    next(error);
  }
});

router.post('/customers', async (req, res, next) => {
  try {
    const customers = await Customer.find();
    // res.send(customers);
    res.render('manage-customers', { customers });
  } catch (error) {
    next(error);
  }
});

router.get('/update-customer/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const customer = await Customer.findById(id);
    res.render('update-customer', { customer });
  } catch (error) {
    next(error);
  }
});


router.post('/update-customer',upload.single("image"), async (req, res, next) => {
  try {
    const {id, image} = req.body;

    // Checking for id and roles in req.body
    if (!id) {
      req.flash('error', 'Invalid request');
      return res.redirect('back');
    }

    // Check for valid mongoose objectID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      req.flash('error', 'Invalid id');
      return res.redirect('back');
    }

    // Finally update the customer
    const customer = await Customer.findByIdAndUpdate(id, req.body);
    req.flash('info', `updated data for ${customer.email}`);
    res.redirect('back');
  } catch (error) {
    next(error);
  }
});

router.get('/delete-customer/:id', async (req, res, next) => {
  try {
    // const {id} = req.params.id;
    // Check for valid mongoose objectID
        // Finally update the customer
    const customer = await Customer.findByIdAndDelete(req.params.id);
    req.flash('info', `deleted data for ${customer.email}`);
    res.redirect('back');
  } catch (error) {
    next(error);
  }
});

router.get(
  '/register-customer-manager',
    async (req, res, next) => {
    res.render('register-customer-manager');
  }
);

router.post(
  '/register-customer-manager', upload.single("image"),
   registerValidator,
    async (req, res, next) => {
    try {
          if (req.file.mimetype !== 'image/png' && req.file.mimetype !=='image/jpg' && req.file.mimetype !== 'application/pdf' && req.file.mimetype !== 'image/jpeg') {
        req.flash('warning', 'Only Image/PDF allowed');
        res.redirect('/admin/register-customer-manager');
        return;
      } 
      if (req.file.size >  1000000 ) {
        req.flash('warning', 'File too large');
        res.redirect('/admin/register-customer-manager');
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


// router.get(
//   '/register-customer',
//     async (req, res, next) => {
//     res.render('register-customer');
//   }
// );

// router.post(
//   '/register-customer',
//    registerValidator,
//   async (req, res, next) => {
//     try {
//       const errors = validationResult(req);
//       if (!errors.isEmpty()) {
//         errors.array().forEach((error) => {
//           req.flash('error', error.msg);
//         });
//         res.render('register-customer', {
//           name: req.body.name,
//           phone: req.body.phone,
//           address: req.body.address,
//           email: req.body.email,
//           messages: req.flash(),
//         });
//         return;
//       }

//       const { email } = req.body;
//       const doesExist = await User.findOne({ email });
//       if (doesExist) {
//         req.flash('warning', 'Username/email already exists');
//         res.redirect('/admin/register-customer');
//         return;
//       }
//       const user = new User(req.body);
//       await user.save();
//       req.flash(
//         'success',
//         `${user.email} registered succesfully, you can now login`
//       );
//     } catch (error) {
//       next(error);
//     }
//   }
// );

module.exports = router;
