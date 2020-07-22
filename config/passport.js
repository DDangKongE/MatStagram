var passport = require('passport'),
    KakaoStrategy = require('passport-kakao').Strategy;
const Users = require('../models/users');

module.exports = () => {
  passport.serializeUser(function(user, done){
    done(null, user);
  });
  
  passport.deserializeUser(function(obj, done){
    done(null, obj);
  });
  
  passport.use("kakao", new KakaoStrategy({
    clientID: process.env.KAKAO_CLIENT_ID,
    clientSecret: process.env.KAKAO_CLIENT_PW,
    callbackURL: "http://localhost:3000/matstagram/oauth"
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
            userNickname: profile.username,
            username:profile.displayName,
            provider: 'kakao',
            kakao: profile._json
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
};