const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);

//Schema
var userSchema = mongoose.Schema({
    id:{type:String, require:[true]},
    userNickname:{type:String, require:[true, 'UserNickname is required']},
    username:{type:String, require:[true, 'UserSubname is required']},
    provider:{type:String, require:[true]},
    json:{}
})

userSchema.plugin(AutoIncrement, {inc_field: 'userNum'});

var Users = mongoose.model('users', userSchema);

module.exports = Users;