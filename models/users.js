const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);

var postsSchema = mongoose.Schema({ postnum: 'string' });
var followsSchema = mongoose.Schema({ usernum: 'string' });
var follwersSchema = mongoose.Schema({ usernum: 'string' });

//Schema
var userSchema = mongoose.Schema({
    id:{type:String, unique : true , require:[true]},
    password:{type:String},
    usernickname:{type:String, require:[true, 'Usernickname is required']},
    username:{type:String, require:[true, 'UserSubname is required']},
    provider:{type:String, require:[true]},
    posts:[postsSchema],
    follow:[followsSchema],
    follower:[follwersSchema],
    profileimg:{type:String},
    json:{},
    changenickname:{type:String}
})

userSchema.plugin(AutoIncrement, {inc_field: 'usernum'});

var Users = mongoose.model('users', userSchema);

module.exports = Users;