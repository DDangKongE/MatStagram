var express = require('express');
var router = express.Router();
var passport = require('passport');
const { session } = require('passport');

/* GET home page. */
router.get('/', function(req, res, next){
    res.render('main/login');
  })

// Login Logic
// KAKAO 
router.get('/auth/kakao', passport.authenticate('kakao'));

router.get('/oauth/kakao', passport.authenticate('kakao', {successRedirect: '/matstagram', failureRedirect: '/matstagram/login'}));
  
// FACEBOOK
router.get('/auth/facebook', passport.authenticate('facebook', {authType: 'rerequest', scope: ['public_profile', 'email']}));

router.get('/oauth/facebook', passport.authenticate('facebook', { successRedirect: '/matstagram', failureRedirect: '/matstagram/login' }), function(req, res) {
    res.redirect('/matstagram');
});

// GOOGLE 
router.get('/auth/google', passport.authenticate('google', {scope: ['https://www.googleapis.com/auth/plus.login']}));

router.get('/oauth/google', passport.authenticate('google', {successRedirect: '/matstagram', failureRedirect: '/matstagram/login'}));

// NAVER 
router.get('/auth/naver', passport.authenticate('naver'), function(req, res) { console.log("/main/naver"); });

router.get('/oauth/naver', passport.authenticate('naver', {successRedirect: '/matstagram', failureRedirect: '/matstagram/login'}));

module.exports = router;
