var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  if (req.isAuthenticated()) {
    console.log("Login now!")
    res.render('main/index', {UserInfo: req.user});
  } else {
    res.render('main/index', {UserInfo: null});
  }
});

router.get('/logout', function(req, res){
  req.logout();
  res.redirect('/matstagram/login');
});

module.exports = router;
