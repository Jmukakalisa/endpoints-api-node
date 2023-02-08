// import passportLocal from 'passport-local';
// const localStrategy = passportLocal.Strategy;
// import session from 'express-session';
// import bcrypt from 'bcrypt';
// // import passport from 'passport';
// import User from '../models/userModels';

// app.use(
//     session({
//       secret: "secret key",
//       resave: false,
//       saveUninitialized: false
//     })
//   );
//   app.use(passport.initialize());
//   app.use(passport.session());

//   const userLogin = (passport) => {
//     passport.use(
//       'local-login',
//       new localStrategy(
//         {
//           usernameField: 'email',
//           passwordField: 'password',
//         },
//         async (email, password, done) => {
//           const user = await User.findOne({ email: email });
//           if (!user) return done(null, false);
  
//           let match = await bcrypt.compare(password, user.password);
//           if (!match) return done(null, false);
  
//           return done(null, user);
//         },
//       ),
//       passport.serializeUser((user, done) => {
//         done(null, user.id);
//       }),
//     );
  
//     passport.deserializeUser(async (id, done) => {
//       try {
//         const user = await User.findById(id);
//         done(null, user);
//       } catch (error) {
//         done(error);
//       }
//     });
//   };
//     1      
// export default userLogin;
