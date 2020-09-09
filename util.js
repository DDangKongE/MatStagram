var util={};

const Users = require('./models/users');
const notifier = require('node-notifier');

util.ischangenickname = function(req, res, next){
    if(req.isAuthenticated()){
        Users.findOne({id:req.user.id}, function(err, loginuser){
            if(loginuser.changenickname == 'Y'){
                next();
            } else {
                notifier.notify({
                    title: 'Matstagram',
                    message: '프로필을 완성해주세요!'
                  });
                res.redirect("/matstagram/profile/" + loginuser.usernickname + "/edit")
            }
        })
    } else {
        next();
    }
}

module.exports = util;