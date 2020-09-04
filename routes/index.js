var express = require('express');
var router = express.Router();
var request = require('request');
var fs = require('fs');
var alert = require('alert');
var moment = require('moment');
var sanitizeHtml = require('sanitize-html');
const util = require('../util');
const Users = require('../models/users');
const Posts = require('../models/posts');
const { remove } = require('../models/users');
moment.locale('ko');

/* GET home page. */
router.get('/', util.ischangenickname, function(req, res, next) {
  if (req.isAuthenticated()) {
    var postsdata = [];
    function usersfind(){
      return new Promise(function(resolve, reject){
        Users.aggregate([{$sample: {size:6}}], function(err, result){
          resolve(result);
        })
      })
    }

    function postsfind(){
      return new Promise(function(resolve, reject){
        Users.findOne({id:req.user.id}, function(err, result){
          function dataload(usernum){
            return new Promise(function(resolve_inner, reject_inner){
              Users.findOne({usernum:usernum}, function(err, userdata){
                Posts.find({writerid:userdata.id}, function(err, data){
                  for(let prop in data){
                    postsdata.push(data[prop]);  
                  }
                  return resolve_inner(postsdata);
                })
              })
            })
          }

          async function postsload(userdata){
            for(let prop in userdata.follow){
              await dataload(userdata.follow[prop].usernum);
            }
            await dataload(req.user.usernum);
            return resolve(postsdata);
          }
          postsload(result);
        })
      })
    }

    async function loadmain(data){
      var Recommends = await usersfind();
      var posts = await postsfind();

      posts.sort(function(a, b){
        return a.postnum > b.postnum ? -1 : a.postnum < b.postnum ? 1 : 0;
      });

      Users.findOne({id:req.user.id}, function(err, logindata){
        res.render('main/index', {UserInfo: logindata, Recommend: Recommends, Posts: posts, moment});
      })
    }
    
    loadmain();


    
  } else {
    Posts.aggregate([{$sample: {size:10}}], function(err, result){
      res.render('main/index', {UserInfo: null, Posts: result ,moment});
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
        console.log(result);
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
      var sanitizedNickname = sanitizeHtml(req.body.usernickname);
      var sanitizedUsername = sanitizeHtml(req.body.username);
      Users.findOne({id:req.user.id}, function(err, result){
        if(req.params.nickname == result.usernickname){
          if(req.params.nickname == req.body.usernickname){
            Users.updateOne({usernickname : result.usernickname}, {usernickname : sanitizedNickname, username : sanitizedUsername}, function(err, result){
              res.redirect('/matstagram/profile/' + sanitizedNickname);
              
            })
          } else {
            Users.updateOne({usernickname : result.usernickname}, {usernickname : sanitizedNickname, username : sanitizedUsername, changenickname:'Y'}, function(err, result){
              res.redirect('/matstagram/profile/' + sanitizedNickname);
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
router.get('/post/new', util.ischangenickname, function(req, res, next) {
  if (req.isAuthenticated()) {
    Users.findOne({id:req.user.id}, function(err, result){
      res.render('main/post_new', {UserInfo: result, PostInfo: null});
    });
  } else {
    alert('로그인을 해주세요!');
    res.redirect('/matstagram/login');
  }
});

router.post('/post/create', util.ischangenickname, function(req, res, next) {
  if (req.isAuthenticated()) {
    var sanitizedContents = sanitizeHtml(req.body.content);
    let samplefile = req.files.photo;
    if(samplefile.mimetype != 'image/png' && samplefile.mimetype != 'image/jpg' && samplefile.mimetype != 'image/jpeg'){
      alert("이미지 파일을 등록해주세요. \n이미지는 JPG, PNG 파일을 등록하실 수 있습니다.")
      return res.redirect('/matstagram/post/new');
    }
    const hashtags = sanitizedContents.match(/#([0-9a-zA-Z가-힣]*)/g)
    Users.findOne({id:req.user.id}, function(err, result){
      Posts.create({
        contents: sanitizedContents,
        nickname: result.usernickname,
        writerid: result.id,
        writernum: req.user.usernum,
        placename: req.body.place_name,
        addressname: req.body.address_name,
        placeid: req.body.place_id
      }, function(err, post){
        if(err) return console.log(err);
        samplefile.mv('./public/userdata/posts/' + post.postnum + '.png'), function(err){
          console.log(samplefile);
          if(err) return res.status(500).send(err);
        }
        if(hashtags != null){
          for(let prop in hashtags){
            Posts.updateOne({postnum:post.postnum}, {$push:{'hashtags':{'tag' : hashtags[prop]}}},function(err){
              if(err) console.log(err);
            });
          }
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

router.get('/post/:postnum/edit', util.ischangenickname, function(req, res, next){
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

router.put('/post/:postnum', util.ischangenickname, function(req, res, next){
  if (req.isAuthenticated()) {
    console.log(req.files);
    if(req.files != null){
      if(req.files.photo.mimetype != 'image/png' && req.files.photo.mimetype != 'image/jpg' && req.files.photo.mimetype != 'image/jpeg'){
        alert("이미지 파일을 등록해주세요. \n이미지는 JPG, PNG 파일을 등록하실 수 있습니다.")
        return res.redirect('/matstagram/post/new');
      }
    }
    var sanitizedContents = sanitizeHtml(req.body.content);
    const hashtags = sanitizedContents.match(/#([0-9a-zA-Z가-힣]*)/g)
    Posts.findOne({postnum:req.params.postnum}, function(error, postdata){
      if(postdata.writerid == req.user.id){
        Posts.updateOne({postnum:req.params.postnum}, {
          contents: sanitizedContents,
          writerid: req.user.id,
          placename: req.body.place_name,
          addressname: req.body.address_name,
          placeid: req.body.place_id,
          hashtags: []
        }, function(err){
          if(err) return console.log(err);
          if(req.files !== null){
            let samplefile = req.files.photo;
            samplefile.mv('./public/userdata/posts/' + postdata.postnum + '.png'), function(err){
              console.log(samplefile);
              if(err) return res.status(500).send(err);
            }
          }
          if(hashtags != null){
            for(let prop in hashtags){
              Posts.updateOne({postnum:postdata.postnum}, {$push:{'hashtags':{'tag' : hashtags[prop]}}},function(err){
                if(err) console.log(err);
              });
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

router.get('/post/:postnum/delete', util.ischangenickname, function(req, res, next){
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

router.get('/post/:postnum', util.ischangenickname, function(req, res, next){
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

router.get('/post/detail/:postnum', util.ischangenickname, function(req, res, next){
  if(req.isAuthenticated()){
    Posts.findOne({postnum:req.params.postnum}, function(err, post){
      if(post){

        Users.findOne({id:post.writerid}, function(err, user){
          var chkfollow = "N"
          for(var prop in user.follower){
            if(user.follower[prop].usernum == req.user.usernum){
            chkfollow = "Y"
          }
        }
        res.render('main/detail-page', {UserInfo: req.user, post:post, user:user, login:req.user, chkfollow: chkfollow, moment});
      })
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

// 좋아요-팔로우 기능
router.post('/post/like/:postnum', util.ischangenickname, function(req, res, next){
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
    alert('로그인을 해주세요!');
    res.redirect('/matstagram/login');
  }
})

router.get('/follow', util.ischangenickname, function(req, res, next){
  if (req.isAuthenticated()) {
    Users.findOne({usernum:req.query.usernum}, function(err, result){
      if(err) console.log(err);

      // 팔로워일경우
      if(req.query.type == "follower"){
        let followerlists = [];
        if(result.follower == ""){
          return res.send({Followers:null});
        }

        function profiledata(usernum){
          return new Promise(function(resolve, reject){
            Users.findOne({usernum:usernum}, function(err, followerdata){
              followerlists.push(followerdata);
              return resolve(followerdata);
            });
          })
        }

        async function followers(data) {
          for(let prop in data.follower){
            await profiledata(data.follower[prop].usernum);
          }
          res.send({Followers:followerlists});
        }

        followers(result);

      // 팔로우일경우
      } else if (req.query.type == "follow"){
        let followlists = [];
        if(result.follow == ""){
          return res.send({Follows:null});
        }

        function profiledata(usernum){
          return new Promise(function(resolve, reject){
            Users.findOne({usernum:usernum}, function(err, followdata){
              followlists.push(followdata);
              return resolve(followdata);
            });
          })
        }

        async function follows(data) {
          for(let prop in data.follow){
            await profiledata(data.follow[prop].usernum);
          }
          res.send({Follows:followlists});
        }

        follows(result);
      }
    });
  } else {
    alert('로그인을 해주세요!');
    res.send({Follows:"비로그인", Followers:"비로그인"});
  }
})

router.post('/follow', util.ischangenickname, function(req, res, next){
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
    alert('로그인을 해주세요!');
    res.send();
  }
})

router.post('/post/comment', util.ischangenickname, function(req, res, next){
  if (req.isAuthenticated()) {
    var sanitizedContents = sanitizeHtml(req.body.contents);
    Users.findOne({id:req.user.id}, function(err, user){
      Posts.updateOne({postnum:req.body.postnum}, {
        $push:{'comments':{'usernum' : user.usernum, 'nickname' : user.usernickname, 'contents' : sanitizedContents}}
      }, function(err, result){
        res.send({usernum:user.usernum, nickname:user.usernickname, contents:sanitizedContents, uploadtime:Date.now()});
      })
    })
  } else {
    alert('로그인을 해주세요!');
    res.send();
  }
})

router.get('/explore', function(req, res, next){
  var start = 0
  if(req.query.start) start = parseInt(req.query.start);

  Posts.find().sort('-likes').skip(start).limit(15).exec(function(err, posts){
    if(err) console.log(err);
    if(start == 0){
      if(req.isAuthenticated()){
        Users.findOne({id:req.user.id}, function(err, result){
          res.render('main/explore', {UserInfo: result, Posts: posts});
        });
      } else {
        res.render('main/explore', {UserInfo: null, Posts: posts});
      }
    } else {
      if(req.isAuthenticated()){
        Users.findOne({id:req.user.id}, function(err, result){
          res.send({UserInfo: result, Posts: posts});
        });
      } else {
        res.send({UserInfo: null, Posts: posts});
      }
    }
  });
})

router.get('/explore/:keyword', function(req, res, next){
  var start = 0
  if(req.query.start) start = parseInt(req.query.start);

  Posts.find({'hashtags':{$elemMatch:{'tag':'#'+req.params.keyword}}}).skip(start).limit(15).exec(function(err, posts){
    if(err) console.log(err);
    if(start == 0){
      if(req.isAuthenticated()){
        Users.findOne({id:req.user.id}, function(err, result){
          res.render('main/explore', {UserInfo: result, Posts: posts});
        });
      } else {
        res.render('main/explore', {UserInfo: null, Posts: posts});
      }
    } else {
      if(req.isAuthenticated()){
        Users.findOne({id:req.user.id}, function(err, result){
          res.send({UserInfo: result, Posts: posts});
        });
      } else {
        res.send({UserInfo: null, Posts: posts});
      }
    }
  });
})

router.get('/test/:tag', function(req, res, next){
  Posts.findOne({postnum:req.params.tag},function(err, result){
    result.hashtags = [];
    result.save();
    res.redirect('/matstagram');
  })
});

router.get('/logout', function(req, res){
  req.logout();
  res.redirect('/matstagram/login');
});

module.exports = router;
