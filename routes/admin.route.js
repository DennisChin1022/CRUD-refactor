const User = require('../models/user.model');
const router = require('express').Router();
const mongoose = require('mongoose');
const { roles } = require('../utils/constants');
const { registerValidator } = require('../utils/validators');
const { body, validationResult } = require('express-validator');

router.get('/users', async (req, res, next) => {
  try {
    const users = await User.find();
    // res.send(users);
    res.render('manage-users', { users });
  } catch (error) {
    next(error);
  }
});

// router.get('/customer', async (req, res, next) => {
//   try {
//     const users = await User.find();
//     // console.log(users)
//     res.render('manage-customer', { users });
//   } catch (error) {
//     next(error);
//   }
// });

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
    const users = await User.find();
    // res.send(customers);
    res.render('manage-customers', { users });
  } catch (error) {
    next(error);
  }
});

router.get('/update-customer/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    res.render('update-customer', { user });
  } catch (error) {
    next(error);
  }
});


router.post('/update-customer', async (req, res, next) => {
  try {
    const {id} = req.body;

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
    const user = await User.findByIdAndUpdate(id, req.body);
    req.flash('info', `updated data for ${user.email}`);
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
    const user = await User.findByIdAndDelete(req.params.id);
    req.flash('info', `deleted data for ${user.email}`);
    res.redirect('back');
  } catch (error) {
    next(error);
  }
});

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
