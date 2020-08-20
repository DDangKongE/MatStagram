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
      Users.findOne({id: req.user.id}, function(err, userdata){
        res.render('main/index', {UserInfo: userdata, Recommend: result});
      })
    })
  } else {
    Posts.aggregate([{$sample: {size:10}}], function(err, result){
      console.log(result);
      res.render('main/index', {UserInfo: null, Posts: result});
    });
  }
});

router.get('/idCheck/', function(req, res, next) {
  res.send({result:false});
});

router.get('/idCheck/:name', function(req, res, next) {
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
  Users.findOne({usernickname:req.params.ninkname}, function(err, result){
    if (err) {
      alert("입력하신 주소는 없는 주소입니다!")
      redirect('/matstagram'); // 회원정보가 없습니다 페이지 만들자
    } else {
      function postsfind(){
        return new Promise(function(resolve, reject){
          Posts.find({writerid:result.id})
          .sort('-postnum')
          .exec(function(err, postslist){
            if(err) return res.json(err);
            resolve(postslist);
            });
        })
      }

      function likesfind(){
        return new Promise(function(resolve, reject){
          Posts.find({'likes.usernum':{$all:[result.usernum]}})
          .exec(function(err, likeslist){
            if(err) return res.json(err);
            resolve(likeslist);
            });
        })
      }

      async function loadProfile(){
        var posts = await postsfind();
        var likes = await likesfind();

        if (req.isAuthenticated()) {
          var chkfollow = "N"
          for(var prop in result.follower){
            if(result.follower[prop].usernum == req.user.usernum){
              chkfollow = "Y"
            }
          }
          res.render('main/profile', {UserInfo: result, PostData: posts, likeData: likes, LoginData: req.user, chkfollow: chkfollow});
        } else {
          res.render('main/profile', {UserInfo: result, PostData: posts, likeData: likes, LoginData: null, chkfollow: null});
        }

      }

      loadProfile();
    }
  })
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
        Users.updateOne({id:result.id},{$push:{'posts':{'postnum' : post.postnum}}}, function(err){
          if(err) console.log(err)
          res.redirect('/matstagram/profile/'+result.usernickname);
        });
      })
    });
  } else {
    alert('로그인을 해주세요!');
    res.redirect('/matstagram/login');
  }
});

router.get('/post/:postnum/edit', function(req, res, next){
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

router.put('/post/:postnum', function(req, res, next){
  if (req.isAuthenticated()) {
    Posts.findOne({postnum:req.params.postnum}, function(error, postdata){
      if(postdata.writerid == req.user.id){
        Posts.updateOne({postnum:req.params.postnum}, {
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

// 씹콜백지옥
router.get('/post/:postnum/delete', function(req, res, next){
  if (req.isAuthenticated()) {
    Posts.findOne({postnum:req.params.postnum}, function(error, postdata){
      if(error) console.log(err);
      if(postdata.writerid == req.user.id){
        Posts.deleteOne({postnum:req.params.postnum}, function(err){
          if(err) console.log(err);
          fs.unlinkSync('public/userdata/posts/'+ req.params.postnum +'.png');
          Users.updateOne({id:req.user.id},{$pull:{'posts': {'postnum' : req.params.postnum}}}, function(err, result){
            if(err) console.log(err)
            res.redirect('/matstagram/my/profile');
          })
        });
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

router.get('/post/:postnum', function(req, res, next){
  if(req.isAuthenticated()){
    Posts.findOne({postnum:req.params.postnum}, function(err, post){
      Users.findOne({id:post.writerid}, function(err, user){
        var chkfollow = "N"
        for(var prop in user.follower){
          if(user.follower[prop].usernum == req.user.usernum){
            chkfollow = "Y"
          }
        }
        res.send({post:post, user:user, login:req.user, chkfollow: chkfollow});
      })
    })
  } else {
      res.send({user:'비로그인'});
  }
})

// 좋아요-팔로우 기능
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

router.post('/follow', function(req, res, next){
  if (req.isAuthenticated()) {
    console.log("도착")
    console.log(req.body.follower)
    console.log(req.body.follow)

    Users.findOne({usernum:req.body.follower, 'follow.usernum':{$all:[req.body.follow]}}, function(err, data){
      if(data==null){
        console.log(data);
        function updatefollow(){
          return new Promise(function(resolve, reject){
            Users.updateOne({usernum:req.body.follower}, {$push:{'follow':{'usernum':req.body.follow}}})
            .exec(function(err, updatefollow){
              if(err) return res.json(err);
              resolve(updatefollow);
            });
          })
        }

        function updatefollower(){
          return new Promise(function(resolve, reject){
            Users.updateOne({usernum:req.body.follow}, {$push:{'follower':{'usernum':req.body.follower}}})
            .exec(function(err, updatefollow){
              if(err) return res.json(err);
              resolve(updatefollow);
            });
          })
        }

        async function execfollow(){
          await updatefollow();
          await updatefollower();

          res.send();
        }
        execfollow();
      } else {
        console.log(data);
        function updatefollow(){
          return new Promise(function(resolve, reject){
            Users.updateOne({usernum:req.body.follower}, {$pull:{'follow':{'usernum':req.body.follow}}})
            .exec(function(err, updatefollow){
              if(err) return res.json(err);
              resolve(updatefollow);
            });
          })
        }

        function updatefollower(){
          return new Promise(function(resolve, reject){
            Users.updateOne({usernum:req.body.follow}, {$pull:{'follower':{'usernum':req.body.follower}}})
            .exec(function(err, updatefollow){
              if(err) return res.json(err);
              resolve(updatefollow);
            });
          })
        }

        async function execfollow(){
          await updatefollow();
          await updatefollower();

          res.send();
        }

        execfollow();
      }
    })
    
  } else {
    res.send();
    alert('로그인을 해주세요!');
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
