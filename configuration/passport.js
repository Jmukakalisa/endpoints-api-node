import passportLocal from 'passport-local';
import User from '../models/users.model.js';
const localStrategy = passportLocal.Strategy;
import bcrypt from 'bcrypt';
// import passport from 'passport';

export const login = (passport) => {
  passport.use(
    'local-login',
    new localStrategy(
      {
        usernameField: 'email',
        passwordField: 'password',
      },
      async (email, password, done) => {
        const user = await User.findOne({ email: email });
        if (!user) return done(null, false);

        let match = await bcrypt.compare(password, user.password);
        if (!match) return done(null, false);

        return done(null, user);
      },
    ),
    passport.serializeUser((user, done) => {
      done(null, user.id);
    }),
  );

  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id);
      done(null, user);
    } catch (error) {
      done(error);
    }
  });
};
