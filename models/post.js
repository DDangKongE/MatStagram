const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);

//Schema
var postSchema = mongoose.Schema({
    posttitle:{type:String, require:[true, 'Postnickname is required']},
    postname:{type:String, require:[true, 'PostSubname is required']},
    writer:{type:String, require:[true]},
    locationname:{type:String, require:[true]},
    locationdetail:{type:String, require:[true]},
    like:{type:Number, default:'0'},
    comment:{}
})

postSchema.plugin(AutoIncrement, {inc_field: 'postNum'});

var Posts = mongoose.model('posts', postSchema);

module.exports = Posts;