const User = require('../models/user.model');
const router = require('express').Router();
const { roles } = require('../utils/constants');
const { registerValidator } = require('../utils/validators');
const { body, validationResult } = require('express-validator');
const multer = require('multer')

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
      const doesExist = await User.findOne({ email });
      if (doesExist) {
        req.flash('warning', 'Username/email already exists');
        res.redirect('/admin/register-customer');
        return;
      }
      console.log(req.file)
      const user = new User({
        name: req.body.name,
        email: req.body.email,
        image: req.file.filename,
        password: req.body.password,
        startdate: req.body.startdate,
      });
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