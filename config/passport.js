const passport = require('passport');
const alert = require('alert');
const fs = require('fs');
const KakaoStrategy = require('passport-kakao').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const NaverStrategy = require('passport-naver').Strategy;
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const Users = require('../models/users');

module.exports = () => {
  passport.serializeUser(function(user, done){
    done(null, user);
  });
  
  passport.deserializeUser(function(obj, done){
    done(null, obj);
  });

  async function createUser(profile, done, user, provider){
    try{
    Users.create({ 
      id:profile.id,
      usernickname: "User" + Math.floor(Math.random() * (9999999999 - 1) + 1),
      username:profile.displayName,
      provider: provider,
      json: profile._json,
      changenickname: 'N'
      }, async function(err, user){
        try{
      if(err) return console.log(err);
          let usernum = user.usernum
          await Users.updateOne({id:user.id}, {profileimg: usernum+'.png'})
          fs.copyFileSync('public/userdata/profile/0.png', `public/userdata/profile/${usernum}.png`)
      return done(null, false, { message: '가입이 완료되었습니다!\n다시 한번 로그인 해주세요!' });
        } catch(error2) {
          console.error(error2);
          done(error2);
        }
    });
    } catch(error){
      console.error(error);
      done(error);
    }
    
  }
      
  // LOCAL
  passport.use("local", new LocalStrategy({
    usernameField: 'id',
    passwordField: 'password',
  }, async (id, password, done) => {
    try {
      const exUser = await Users.findOne({ 'id' : id });
      if(exUser) {
        const result = await bcrypt.compare(password, exUser.password);
        if(result) {
            done(null, exUser);
        } else {
            done(null, false, { message: '비밀번호가 일치하지 않습니다.' });
        }
      } else {
        const hash = await bcrypt.hash(password, 12);
        await Users.create({ 
          id: id,
          password: hash,
          usernickname: "User" + Math.floor(Math.random() * (9999999999 - 1) + 1),
          username: "",
          provider: 'local',
          profileimg : '0.png',
          changenickname: 'N'
        }, async function(err, user){
          try{
          if(err) return console.log(err);
            let usernum = user.usernum
            await Users.updateOne({id:user.id}, {profileimg: usernum+'.png'})
            fs.copyFileSync('public/userdata/profile/0.png', `public/userdata/profile/${usernum}.png`)
          return done(null, false, { message: '가입이 완료되었습니다!\n다시 한번 로그인 해주세요!' });
          } catch(error2) {
            console.error(error2);
            done(error2);
          }
    });

        // done(null, false, { message: '가입되지 않은 회원입니다.' });
  }
    } catch(err) {
      console.error(err);
      done(err);
    }
  }));
      
  // KAKAO
  passport.use("kakao", new KakaoStrategy({
    clientID: process.env.KAKAO_CLIENT_ID,
    clientSecret: process.env.KAKAO_CLIENT_PW,
    callbackURL: "http://ddangkonge.ddns.net:3025/matstagram/login/oauth/kakao"
    },
    function(accessToken, refreshToken, profile, done){
      Users.findOne({
        'id' : profile.id
      }, function(err, user){
        if(err) return done(err);
        if(!user){
          createUser(profile, done, user, profile.provider);
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
    callbackURL: "http://ddangkonge.ddns.net:3025/matstagram/login/oauth/facebook"
    },
    function(req, accessToken, refreshToken, profile, done){
      Users.findOne({
        'id' : profile.id
      }, function(err, user){
        if(err) return done(err);
        if(!user){
          createUser(profile, done, user, profile.provider);
        }else{
            return done(err, user);
        }
      })
    }));

  // GOOGLE
  passport.use("google", new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_PW,
    callbackURL: "http://ddangkonge.ddns.net:3025/matstagram/login/oauth/google"
    },
    function(accessToken, refreshToken, profile, done){
      Users.findOne({
        'id' : profile.id
      }, function(err, user){
        if(err) return done(err);
        if(!user){
          createUser(profile, done, user, profile.provider);
        }else{
            return done(err, user);
        }
      })
    }));


  passport.use("naver", new NaverStrategy({
    clientID: process.env.NAVER_CLIENT_ID,
    clientSecret: process.env.NAVER_CLIENT_PW,
    callbackURL: "http://ddangkonge.ddns.net:3025/matstagram/login/oauth/naver"
    },
    function(accessToken, refreshToken, profile, done){
      Users.findOne({
        'id' : profile.id
      }, function(err, user){
        if(err) return done(err);
        if(!user){
          createUser(profile, done, user, profile.provider);
        }else{
            return done(err, user);
        }
      })
    }));
};