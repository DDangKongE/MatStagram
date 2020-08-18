var express = require('express');
var router = express.Router();
var request = require('request');
var fs = require('fs');
var alert = require('alert');
const Users = require('../models/users');
const Posts = require('../models/posts');

/* GET home page. */
router.get('/', function(req, res, next) {
  if (req.isAuthenticated()) {
    Users.aggregate([{$sample: {size:6}}], function(err, result){
      console.log(result);
      Users.findOne({id: req.user.id}, function(err, userdata){
        res.render('main/index', {UserInfo: userdata, Recommend: result});
      })
    })
  } else {
    res.render('main/index', {UserInfo: null});
  }
});

router.get('/idCheck/', function(req, res, next) {
  res.send({result:false});
});

router.get('/idCheck/:name', function(req, res, next) {
  console.log(req.params.name);
  Users.findOne({usernickname : req.params.name}, function(err, data){
    if(data){
      res.send({result:true});
    } else {
      res.send({result:false});
    }
  })
});

router.get('/my/profile', function(req, res, next) {
  if (req.isAuthenticated()) {
    Users.findOne({id:req.user.id}, function(err, result){
      res.redirect('/matstagram/profile/' + result.usernickname);
    })
  } else {
    alert('로그인을 해주세요!');
    res.redirect('/matstagram/login');
  }
});

router.get('/profile/:ninkname', function(req, res, next) {
  if (req.isAuthenticated()) {
    Users.findOne({usernickname:req.params.ninkname}, function(err, result){
      if (err) {
        redirect('/matstagram'); // 회원정보가 없습니다 페이지 만들자
      } else {
        Posts.find({writerid:result.id}).sort('-postnum').exec(function(err, posts){
          Posts.find({'likes.usernum':{$all:[result.usernum]}}, function(err, likes){
            console.log(likes);
            res.render('main/profile', {UserInfo: result, PostData: posts, likeData: likes});
          })
        });
      }
    })
  } else {
    alert('로그인을 해주세요!');
    res.redirect('/matstagram/login');
  }
});

router.get('/profile/:nickname/edit', function(req, res, next) {
  if (req.isAuthenticated()) {
    if(req.user){
      Users.findOne({usernickname:req.params.nickname}, function(err, result){
        if(result.id == req.user.id){
          res.render('main/profile_edit', {UserInfo: result});
        } else {
          alert('잘못된 접근입니다! \n다시한번 시도해주세요!');
          res.redirect('/matstagram');
        }
      });
    } else {
      alert('잘못된 접근입니다! \n다시한번 시도해주세요!');
      res.redirect('/matstagram');
    }
  } else {
    alert('로그인을 해주세요!');
    res.redirect('/matstagram/login');
  }
});

router.post('/profile/:nickname/edit', function(req, res, next) {
  if (req.isAuthenticated()) {
    if(req.user){
      Users.findOne({id:req.user.id}, function(err, result){
        if(req.params.nickname == result.usernickname){
          if(req.params.nickname == req.body.usernickname){
            Users.updateOne({usernickname : result.usernickname}, {usernickname : req.body.usernickname, username : req.body.username}, function(err, result){
              res.redirect('/matstagram/profile/' + req.body.usernickname);
            })
          } else {
            Users.updateOne({usernickname : result.usernickname}, {usernickname : req.body.usernickname, username : req.body.username, changenickname:'Y'}, function(err, result){
              res.redirect('/matstagram/profile/' + req.body.usernickname);
            })
          }
        } else {
          alert('잘못된 접근입니다! \n다시한번 시도해주세요!');
          res.redirect('/matstagram');
        }
      });
    } else {
      alert('잘못된 접근입니다! \n다시한번 시도해주세요!');
      res.redirect('/matstagram');
    }
  } else {
    alert('로그인을 해주세요!');
    res.redirect('/matstagram/login');
  }
});

router.post('/profile/:nickname/edit/img', function(req, res, next) {
  if(req.user){
    let samplefile = req.files.inputimg;
    Users.findOne({id:req.user.id}, function(err, result){
      if(req.params.nickname == result.usernickname){
        if(req.files===undefined){
          res.redirect('/matstagram/profile/' + req.params.nickname + '/edit');
        } else {
          samplefile.mv('./public/userdata/profile/' + result.usernum + '.png'), function(err){
            console.log(req.files.inputimg);
            if(err) return res.status(500).send(err);
          }
          Users.updateOne({id: result.id}, {profileimg: result.usernum+'.png'}, function(err, resultUpdate){
            res.redirect('/matstagram/profile/' + req.params.nickname + '/edit');
          })
        }
      } else {
        alert('잘못된 접근입니다! \n다시한번 시도해주세요!');
        res.redirect('/matstagram');
      }
    });
  } else {
    alert('로그인을 해주세요!');
    res.redirect('/matstagram');
  }
});

// post(게시물) 관련 router
router.post('/post/show/:postnum', function(req, res, next){
  if(req.user){
    console.log("로그인되어있다!")
    Posts.findOne({postnum:req.params.postnum}, function(err, result){
      Users.findOne({id:result.writerid}, function(err, user){
        res.send({result:result, user:user, login:req.user});
      })
    })
  } else {
    Posts.findOne({postnum:req.params.postnum}, function(err, result){
      res.send({result:result, user:'비로그인'});
    })
  }
})

router.get('/post/new', function(req, res, next) {
  if (req.isAuthenticated()) {
    Users.findOne({id:req.user.id}, function(err, result){
      res.render('main/post_new', {UserInfo: result, PostInfo: null});
    });
  } else {
    alert('로그인을 해주세요!');
    res.redirect('/matstagram/login');
  }
});

router.post('/post/create', function(req, res, next) {
  if (req.isAuthenticated()) {
    let samplefile = req.files.photo;
    Users.findOne({id:req.user.id}, function(err, result){
      Posts.create({
        contents: req.body.content,
        writerid: req.user.id,
        placename: req.body.place_name,
        addressname: req.body.address_name,
        placeid: req.body.place_id
      }, function(err, post){
        if(err) return console.log(err);
        samplefile.mv('./public/userdata/posts/' + post.postnum + '.png'), function(err){
          console.log(samplefile);
          if(err) return res.status(500).send(err);
        }
        Users.updateOne({id:result.id},{$push:{posts:post.postnum}}, function(err){
          if(err) console.log(err)
          res.redirect('/matstagram/profile/'+result.usernickname);
        })
      })
    });
  } else {
    alert('로그인을 해주세요!');
    res.redirect('/matstagram/login');
  }
});

router.get('/post/edit/:postnum', function(req, res, next){
  if (req.isAuthenticated()) {
    Posts.findOne({postnum:req.params.postnum}, function(error, postdata){
      if(postdata.writerid == req.user.id){
        Users.findOne({id:req.user.id}, function(err, result){
          res.render('main/post_new', {UserInfo: result, PostInfo: postdata});
        });
      } else {
        alert('잘못된 접근입니다! \n다시한번 시도해주세요!');
        res.redirect('/matstagram');
      }
    })
  } else {
    alert('로그인을 해주세요!');
    res.redirect('/matstagram/login');
  }
})

router.post('/post/update', function(req, res, next){
  if (req.isAuthenticated()) {
    Posts.findOne({postnum:req.body.postnum}, function(error, postdata){
      if(postdata.writerid == req.user.id){
        Posts.updateOne({postnum:req.body.postnum}, {
          contents: req.body.content,
          writerid: req.user.id,
          placename: req.body.place_name,
          addressname: req.body.address_name,
          placeid: req.body.place_id
        }, function(err){
          if(err) return console.log(err);
          if(req.files !== null){
            let samplefile = req.files.photo;
            samplefile.mv('./public/userdata/posts/' + postdata.postnum + '.png'), function(err){
              console.log(samplefile);
              if(err) return res.status(500).send(err);
            }
          }
          Users.findOne({id:req.user.id}, function(err, userdata){
            res.redirect('/matstagram/profile/' + userdata.usernickname);
          })
        })
      } else {
        alert('잘못된 접근입니다! \n다시한번 시도해주세요!');
        res.redirect('/matstagram');
      }
    });
  } else {
    alert('로그인을 해주세요!');
    res.redirect('/matstagram/login');
  }
})

router.post('/post/like/:postnum', function(req, res, next){
  if (req.isAuthenticated()) {
    Posts.findOne({postnum:req.params.postnum}, function(err,result){
      if(err) console.log(err);
      var chklikes = 'N';
      for(var prop in result.likes){
        if(prop !== 0){
          if(result.likes[prop].usernum == req.user.usernum){
            chklikes = 'Y';
          }
        }
      }
      if(chklikes === 'Y'){
        Posts.updateOne({postnum:req.params.postnum}, {$pull:{'likes' : {'usernum':req.user.usernum}}}, function(err){
          if(err) console.log(err);
        })
      } else {
        Posts.updateOne({postnum:req.params.postnum}, {$push:{'likes' : {'usernum':req.user.usernum}}}, function(err){
          if(err) console.log(err);
        })
      }
    })
    res.send();
  } else {
    res.send();
  }
})

router.get('/explore', function(req, res, next){
  Users.findOne({id:req.user.id}, function(err, result){
    res.render('main/explore', {UserInfo: result});
  });
  
})

router.get('/logout', function(req, res){
  req.logout();
  res.redirect('/matstagram/login');
});

module.exports = router;
