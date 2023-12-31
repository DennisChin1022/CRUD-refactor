const express = require('express');
const createHttpError = require('http-errors');
const morgan = require('morgan');
const mongoose = require('mongoose');
require('dotenv').config();
require('dotenv').config({ path: 'config.env' });
const session = require('express-session');
const connectFlash = require('connect-flash');
const { ensureLoggedIn } = require('connect-ensure-login');
const passport = require('passport');
const { roles } = require('./utils/constants');
const connectMongo = require('connect-mongo');


// Initialization
const app = express();
app.use(morgan('dev'));
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use('/uploads', express.static('uploads'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Init Session
const MongoStore = connectMongo(session);
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      // secure: true,
      httpOnly: true,
    },
    store: new MongoStore({ mongooseConnection: mongoose.connection }),
  })
);

// For Passport JS Authentication
app.use(passport.initialize());
app.use(passport.session());
require('./utils/passport.auth');

app.use((req, res, next) => {
  res.locals.user = req.user;
  next();
});

// Connect Flash
app.use(connectFlash());
app.use((req, res, next) => {
  res.locals.messages = req.flash();
  next();
});

// Routes
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
app.use(
  '/retailer',
  ensureLoggedIn({ redirectTo: '/auth/login' }),
  ensureRetailer,
  require('./routes/retailer.route')
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

// Setting the PORT
const PORT = process.env.PORT || 3000;

// Making a connection to MongoDB
mongoose
  .connect(process.env.MONGO_URI, {
    dbName: process.env.DB_NAME,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
   
  })
  .then(() => {
    console.log('💾 connected...');
    // Listening for connections on the defined PORT
    app.listen(PORT, () => console.log(`🚀 @ http://localhost:${PORT}`));
  })
  .catch((err) => console.log(err.message));
// function ensureAuthenticated(req, res, next) {
//   if (req.isAuthenticated()) {
//     next();
//   } else {
//     res.redirect('/auth/login');
//   }
// }

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


if (typeof window !== 'undefined') {
  // 👉️ can use document here
  console.log('You are on the browser')
  console.log(document.title)
  console.log(document.getElementsByClassName('my-class'));
} else {
  // 👉️ can't use document here
  console.log('You are on the window')
}

// const search = document.querySelector('.input-group input'),
//     table_rows = document.querySelectorAll('tbody tr'),
//     table_headings = querySelectorAll('thead th');

// // 1. Searching for specific data of HTML table
// search.addEventListener('input', searchTable);

// function searchTable() {
//     table_rows.forEach((row, i) => {
//         let table_data = row.textContent.toLowerCase(),
//             search_data = search.value.toLowerCase();

//         row.classList.toggle('hide', table_data.indexOf(search_data) < 0);
//     })

//     document.querySelectorAll('tbody tr:not(.hide)').forEach((visible_row, i) => {
//         visible_row.style.backgroundColor = (i % 2 == 0) ? 'transparent' : '#0000000b';
//     });
// }

// const search = document.querySelector("[data-search]")

// let users = []

// search.addEventListener("input", e => {
//   const value = e.target.value()
//   console.log(value)
// })

// function search() {
//   let input = document.getElementById('search').value
//   input=input.toLowerCase();
//   let x = document.getElementsByClassName('brandname');
    
//   for (i = 0; i < x.length; i++) { 
//       if (!x[i].innerHTML.toLowerCase().includes(input)) {
//           x[i].style.display="none";
//       }
//       else {
//           x[i].style.display="list-item";                 
//       }
//   }
// }