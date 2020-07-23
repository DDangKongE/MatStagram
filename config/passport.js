const passport = require('passport');
const KakaoStrategy = require('passport-kakao').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const NaverStrategy = require('passport-naver').Strategy;
const Users = require('../models/users');

module.exports = () => {
  passport.serializeUser(function(user, done){
    done(null, user);
  });
  
  passport.deserializeUser(function(obj, done){
    done(null, obj);
  });

  // KAKAO
  passport.use("kakao", new KakaoStrategy({
    clientID: process.env.KAKAO_CLIENT_ID,
    clientSecret: process.env.KAKAO_CLIENT_PW,
    callbackURL: "http://localhost:3000/matstagram/login/oauth/kakao"
    },
    function(accessToken, refreshToken, profile, done){
      console.log(profile);
      Users.findOne({
        'id' : profile.id
      }, function(err, user){
        if(err) return done(err);
        if(!user){
          Users.create({ 
            id:profile.id,
            userNickname: profile.displayName,
            username:profile.displayName,
            provider: 'kakao',
            data: profile._json
            }, function(err, post){
            if(err) return console.log(err);
            return done(err, user);
          });
        }else{
            return done(err, user);
        }
      })
    }
  ));

  // FACEBOOK
  passport.use("facebook", new FacebookStrategy({
    clientID: process.env.FACEBOOK_CLIENT_ID,
    clientSecret: process.env.FACEBOOK_CLIENT_PW,
    callbackURL: "http://localhost:3000/matstagram/login/oauth/facebook"
    },
    function(req, accessToken, refreshToken, profile, done){
      console.log(profile);
      Users.findOne({
        'id' : profile.id
      }, function(err, user){
        if(err) return done(err);
        if(!user){
          Users.create({ 
            id:profile.id,
            userNickname: profile.displayName,
            username:profile.displayName,
            provider: 'facebook',
            data: profile._json
            }, function(err, post){
            if(err) return console.log(err);
            return done(err, user);
          });
        }else{
            return done(err, user);
        }
      })
    }));

  // GOOGLE
  passport.use("google", new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_PW,
    callbackURL: "http://localhost:3000/matstagram/login/oauth/google"
    },
    function(accessToken, refreshToken, profile, done){
      console.log(profile);
      Users.findOne({
        'id' : profile.id
      }, function(err, user){
        if(err) return done(err);
        if(!user){
          Users.create({ 
            id:profile.id,
            userNickname: profile.displayName,
            username:profile.displayName,
            provider: 'google',
            data: profile._json
            }, function(err, post){
            if(err) return console.log(err);
            return done(err, user);
          });
        }else{
            return done(err, user);
        }
      })
    }));


  passport.use("naver", new NaverStrategy({
    clientID: process.env.NAVER_CLIENT_ID,
    clientSecret: process.env.NAVER_CLIENT_PW,
    callbackURL: "http://localhost:3000/matstagram/login/oauth/naver"
    },
    function(accessToken, refreshToken, profile, done){
      console.log(profile);
      Users.findOne({
        'id' : profile.id
      }, function(err, user){
        if(err) return done(err);
        if(!user){
          Users.create({ 
            id:profile.id,
            userNickname: profile.displayName,
            username:profile.displayName,
            provider: 'naver',
            data: profile._json
            }, function(err, post){
            if(err) return console.log(err);
            return done(err, user);
          });
        }else{
            return done(err, user);
        }
      })
    }));
};