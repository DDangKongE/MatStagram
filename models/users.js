const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);

var postsSchema = mongoose.Schema({ postnum: 'string' });

//Schema
var userSchema = mongoose.Schema({
    id:{type:String, unique : true , require:[true]},
    usernickname:{type:String, require:[true, 'Usernickname is required']},
    username:{type:String, require:[true, 'UserSubname is required']},
    provider:{type:String, require:[true]},
    posts:[postsSchema],
    follow:[{

    }],
    follower:[{
        
    }],
    profileimg:{type:String},
    json:{},
    changenickname:{type:String}
})

userSchema.plugin(AutoIncrement, {inc_field: 'usernum'});

var Users = mongoose.model('users', userSchema);

module.exports = Users;