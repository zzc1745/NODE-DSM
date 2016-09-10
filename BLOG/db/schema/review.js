var mongoose = require('mongoose');
var Schema = mongoose.Schema;

/* 评论定义 */
var reviewSchema = new Schema ({
    author: String,
    content: String,
    createAt : { type:Date, default:Date.now() },
    blogId : String,
    // blogId: {
    //     type : Schema.Types.ObjectId,
    //     ref: 'News'
    // }
});

module.exports = mongoose.model('Review',reviewSchema);