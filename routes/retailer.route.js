const User = require('../models/user.model');
const router = require('express').Router();
const { roles } = require('../utils/constants');
const { registerValidator } = require('../utils/validators');
const { body, validationResult } = require('express-validator');


router.get('/customers', async (req, res, next) => {
  try {
    const users = await User.find();
    // res.send(customers);
    res.render('micro-customers', { users });
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
  '/register-customer',
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
        res.redirect('/admin/register-customer');
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

module.exports = router;