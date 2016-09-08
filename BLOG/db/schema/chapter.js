var mongoose  = require('../db');
var Schema = mongoose.Schema;

//章节信息
var chapterSchema = new Schema({
    moocID: String,
    week: Number,        //周数
    chapters : Number,   //每周课时数
    title: String,
    content: String,
    meta: {
        updateAt: {type:Date, default: Date.now()},
        createAt: {type:Date, default: Date.now()}
    },
});


chapterSchema.pre('save', function (next) {
    if(this.isNew) {
        this.meta.createAt = this.meta.updateAt = Date.now();
    }else{
        this.meta.updateAt = Date.now();
    }
    next();
})

module.exports = mongoose.model('Chapter', chapterSchema);