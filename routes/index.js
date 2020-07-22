var express = require('express');
var router = express.Router();
var passport = require('passport');
const { session } = require('passport');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});



// Login 
router.get('/auth/google', passport.authenticate('google', {scope: ['https://www.googleapis.com/auth/plus.login']}));

router.get('/auth/google/callback', passport.authenticate('google', {failureRedirect: '/login'}),
  function(req, res){
    console.log("session : " + session());
    res.redirect('/matstagram');
  })
  
  router.get('/logout', function(req, res){
  req.logout();
  res.redirect('/matstagram');
});

module.exports = router;
