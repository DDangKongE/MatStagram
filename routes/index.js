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

router.get('/my/profile', function(req, res, next) {
  if (req.isAuthenticated()) {
    res.redirect('/matstagram/profile/' + req.user.userNickname);
  } else {
    res.redirect('/matstagram/login');
  }
});

router.get('/profile/:id', function(req, res, next) {
    res.render('main/profile', {UserInfo: req.user});
});

router.get('/profile/:id/edit', function(req, res, next) {
  console.log(req.user);
  if(req.user){
    if(req.params.id == req.user.userNickname){
      res.render('main/profile_edit', {UserInfo: req.user});
    } else {
      res.redirect('/matstagram');
    }
  } else {
    res.redirect('/matstagram');
  }
});

router.get('/post/new', function(req, res, next) {
  if (req.isAuthenticated()) {
    res.render('main/post_new', {UserInfo: req.user});
  } else {
    res.redirect('/matstagram/login');
  }
});

router.post('/post/create', function(req, res, next) {
    res.redirect('/matstagram');
});

router.get('/explore', function(req, res, next){
  res.render('main/explore', {UserInfo: req.user});
})

router.get('/logout', function(req, res){
  req.logout();
  res.redirect('/matstagram/login');
});

module.exports = router;
