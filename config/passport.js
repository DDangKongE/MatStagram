var passport = require('passport');
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

module.exports = () => {
  passport.serializeUser(function(user, done){
    done(null, user);
  });
  
  passport.deserializeUser(function(obj, done){
    done(null, obj);
  });
  
  passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_PW,
    callbackURL: "/auth/google/callback"
    },
    function(accessToken, refreshToken, profile, done){
      process.nextTick(function(){
        return done(null, profile);
      });
    }
  ));
};