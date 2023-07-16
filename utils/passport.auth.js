const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/user.model');
const Customer = require('../models/customer.model');

passport.use(
  new LocalStrategy(
    {
      usernameField: 'email',
      passwordField: 'password',
    },
    async (email, password, done) => {
      try {
        const user = await User.findOne({ email });
        // Username/email does NOT exist
        if (!user) {
          return done(null, false, {
            message: 'Username/email not registered',
          });
        }
        // Email exist and now we need to verify the password
        const isMatch = await user.password;
        return isMatch
          ? done(null, user)
          : done(null, false, { message: 'Incorrect password' });
      } catch (error) {
        done(error);
      }
    }
  )
);

passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser(function (id, done) {
  User.findById(id, function (err, user) {
    done(err, user);
  });
});

// passport.use(
//   new LocalStrategy(
//     {
//       usernameField: 'email',
//       passwordField: 'password',
//     },
//     async (email, password, done) => {
//       try {
//         const customer = await Customer.findOne({ email });
//         // Username/email does NOT exist
//         if (!customer) {
//           return done(null, false, {
//             message: 'Username/email not registered',
//           });
//         }
//         // Email exist and now we need to verify the password
//         const isMatch = await customer.password;
//         return isMatch
//           ? done(null, customer)
//           : done(null, false, { message: 'Incorrect password' });
//       } catch (error) {
//         done(error);
//       }
//     }
//   )
// );

// passport.serializeUser(function (customer, done) {
//   done(null, customer.id);
// });

// passport.deserializeUser(function (id, done) {
//   Customer.findById(id, function (err, customer) {
//     done(err, customer);
//   });
// });