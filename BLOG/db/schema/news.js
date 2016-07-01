var mongoose = require('../db');
var Schema = mongoose.Schema;


/* 新闻定义 */
var newsSchema = new Schema({
    title: String,
    content: String,
    meta: {
        updateAt: {type:Date, default: Date.now()},
        createAt: {type:Date, default: Date.now()}
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
});

//news模型的保存前检查
newsSchema.pre('save', function (next) {
    if(this.isNew) {
        this.meta.createAt = this.meta.updateAt = Date.now();
    }else{
        this.meta.updateAt = Date.now();
    }
    next();
})

//存在News表中
module.exports = mongoose.model('News', newsSchema);
