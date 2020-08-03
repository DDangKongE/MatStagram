const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);

//Schema
var postSchema = mongoose.Schema({
    contents:{type:String, require:[true]},
    writerid:{type:String, require:[true]},
    placename:{type:String, require:[true]},
    addressname:{type:String, require:[true]},
    placeid:{type:String, require:[true]},
    // 임시
    like:[{
        username: {type:String} 
    }],
    hashtags:[{
        username: {type:String}
    }],
    comments:[{
        username: {type:String}
    }]
})

postSchema.plugin(AutoIncrement, {inc_field: 'postNum'});

var Posts = mongoose.model('posts', postSchema);

module.exports = Posts;