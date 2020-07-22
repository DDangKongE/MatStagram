var express = require('express');
var router = express.Router();
var passport = require('passport');
const { session } = require('passport');
const Users = require('../models/users');

/* GET home page. */
router.get('/', function(req, res, next) {
  if (req.isAuthenticated()) {
    console.log("Login now!")
    res.render('index', {UserInfo: req.user});
  } else {
    res.render('index', {UserInfo: null});
  }
});



// Login 
router.get('/auth/kakao', passport.authenticate('kakao'));

router.get('/oauth', passport.authenticate('kakao', {successRedirect: '/matstagram', failureRedirect: '#!/login'}));
  
router.get('/logout', function(req, res){
  req.logout();
  res.redirect('/matstagram');
});

module.exports = router;
