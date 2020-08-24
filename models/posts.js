const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);

var likesSchema = mongoose.Schema({ usernum: 'string' });
var hashsSchema = mongoose.Schema({ usernum: 'string' });
var commentsSchema = mongoose.Schema({ 
    usernum: 'string',
    nickname: 'string',
    contents: 'string',
    uploadtime: {type:Date, default:Date.now}
});

//Schema
var postSchema = mongoose.Schema({
    contents:{type:String, require:[true]},
    nickname:{type:String, require:[true]},
    writerid:{type:String, require:[true]},
    writernum:{type:String, require:[true]},
    placename:{type:String, require:[true]},
    addressname:{type:String, require:[true]},
    placeid:{type:String, require:[true]},
    uploadtime:{type:Date, default:Date.now},
    likes:[likesSchema],
    hashtags:[hashsSchema],
    comments:[commentsSchema]
})

postSchema.plugin(AutoIncrement, {inc_field: 'postnum'});

var Posts = mongoose.model('posts', postSchema);

module.exports = Posts;