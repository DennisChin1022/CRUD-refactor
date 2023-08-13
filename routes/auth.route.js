const router = require('express').Router();
const passport = require('passport');
const { ensureLoggedOut, ensureLoggedIn } = require('connect-ensure-login');
const User = require('../models/user.model');
const jwt = require("jsonwebtoken");
var nodemailer = require('nodemailer')
require('dotenv').config();
require('dotenv').config({ path: 'config.env' });
const crypto = require('crypto');
const bcrypt = require('bcrypt');
let nonce = crypto.randomBytes(16).toString('base64');

const JWT_SECRET = process.env.SECRET_SECRET

router.get(
  '/login',
  ensureLoggedOut({ redirectTo: '/' }),
  async (req, res, next) => {
    res.render('login');
  }
);

router.post(
  '/login',
  ensureLoggedOut({ redirectTo: '/' }),
  passport.authenticate('local', {
    // successRedirect: '/',
    successReturnToOrRedirect: '/admin/customers',
    failureRedirect: '/auth/login',
    failureFlash: true,
  })
);

router.get(
  '/logout',
  ensureLoggedIn({ redirectTo: '/' }),
  async (req, res, next) => {
    req.logout();
    res.redirect('/');
  }
);

router.get(
  '/forgot-password',
    async (req, res, next) => {
    res.render('forgot-password');
  }
);

const secret = JWT_SECRET + nonce;


router.post("/forgot-password", async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      req.flash('warning', 'If the account exists, a password reset link has been sent to you by email');
        res.redirect('/auth/forgot-password');
    }
    const token = jwt.sign({ email: user.email, id: user._id }, secret, {
      expiresIn: "15m",
    });
    const link = `http://localhost:3000/auth/reset-password/${user._id}/${token}`;
    const transporter = nodemailer.createTransport({
      service:'gmail',
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: "leagues995@gmail.com",
        pass: "ewdvadjuxxtjwwuv",
      },
      //to prevent self-signed certificate error
      tls: {
        rejectUnauthorized: false
    }
    });

    const mailOptions = {
      // send mail with defined transport object
        from: {
          name: 'leagues995@gmail.com'}, // sender address
        to: email, // list of receivers
        subject: "Reset Password", // Subject line
        text: link, // plain text body
        html: link, // html body
      };

    const sendMail = async(transporter, mailOptions) =>{
      try {
        await transporter.sendMail(mailOptions);
        console.log('Email has been sent!')
      }catch (error){
        console.error(error);
      }
    }
    sendMail(transporter, mailOptions);
    console.log(link);
  } catch (error) { }
});

router.get("/reset-password/:id/:token", async (req, res) => {
  const { id, token } = req.params;
  console.log(req.params);
  const user = await User.findOne({ _id: id });
  if (!user) {
    return res.json({ status: "User Not Exists!!" });
  }
  try {
    const verify = jwt.verify(token, secret);
    res.render("reset-password", { email: verify.email, status: "Not Verified" });
  } catch (error) {
    console.log(error);
    res.send("Not Verified");
  }
});

router.post("/reset-password/:id/:token", async (req, res) => {
  const { id, token } = req.params;
  const user = await User.findOne({ _id: id });
  if (!user) {
    return res.json({ status: "User Not Exists!!" });
  }
  const secret = JWT_SECRET + nonce;
  try {
    const verify = jwt.verify(token, secret);
    const { password } = req.body;
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    await User.updateOne(
      {
        _id: id,
      },
      {
        $set: {
          password: hashedPassword,
        },
      }
    );

    res.render("index", { email: verify.email, status: "verified" });
  } catch (error) {
    console.log(error);
    res.json({ status: "Something Went Wrong" });
  }
});

module.exports = router;