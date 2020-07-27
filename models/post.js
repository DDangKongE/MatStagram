const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);

//Schema
var postSchema = mongoose.Schema({
    posttitle:{type:String, require:[true, 'PostNickname is required']},
    postname:{type:String, require:[true, 'PostSubname is required']},
    provider:{type:String, require:[true]},
    json:{}
})

postSchema.plugin(AutoIncrement, {inc_field: 'postNum'});

var Posts = mongoose.model('posts', postSchema);

module.exports = Posts;