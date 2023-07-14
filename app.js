const express = require('express');
const createHttpError = require('http-errors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const session = require('express-session');
const connectFlash = require('connect-flash');
const passport = require('passport');
const { ensureLoggedIn } = require('connect-ensure-login');
const { roles } = require('./middleware/constants');  

const app = express();
dotenv.config( { path : 'config.env'} )
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended : false}))

app.use(
    session({
      secret: 'sercret data',
      resave: false,
      saveUninitialized: false,
      cookie: {
        // secure: true,
        httpOnly: true,
      },
})
);

//For passport JS authen
app.use(passport.initialize());
app.use(passport.session());
require('./middleware/passport.auth');

app.use((req, res, next) => {
    res.locals.user = req.user;
    next();
  });

  //Connect Flash
app.use(connectFlash());
app.use((req, res, next) => {
  res.locals.messages = req.flash();
  next();
});

//routes
app.use('/', require('./routes/index.route'));
app.use('/auth', require('./routes/auth.route'));
app.use(
  '/user',
  ensureLoggedIn({ redirectTo: '/auth/login' }),
  require('./routes/user.route')
);
app.use(
  '/admin',
  ensureLoggedIn({ redirectTo: '/auth/login' }),
  ensureAdmin,
  require('./routes/admin.route')
);

// 404 Handler
app.use((req, res, next) => {
  next(createHttpError.NotFound());
});

// Error Handler
app.use((error, req, res, next) => {
  error.status = error.status || 500;
  res.status(error.status);
  res.render('error_40x', { error });
});

//Setting the Port
const PORT = process.env.PORT || 3000

//Coonect to MongoDB
const dbURI = 'mongodb+srv://Admin:admin123@cluster0.ypdbyg5.mongodb.net/users?retryWrites=true&w=majority';
mongoose.connect(dbURI, { useNewUrlParser: true})
  .then((result) => app.listen(3000))
  .catch((err) => console.log(err));

function ensureAdmin(req, res, next) {
if (req.user.role === roles.admin) {
    next();
} else {
    req.flash('warning', 'you are not Authorized to see this route');
    res.redirect('/');
}
}

function ensureRetailer(req, res, next) {
if (req.user.role === roles.retailer) {
    next();
} else {
    req.flash('warning', 'you are not Authorized to see this route');
    res.redirect('/');
}
}