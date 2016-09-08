var mongoose  = require('../db');
var Schema = mongoose.Schema;

//章节信息
var chapterInfoSchema = new Schema({
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

//课程信息
var moocSchema = new Schema({
    moocName:String,
    teacher:String,
    moocPic: String,   //慕课封面图
    meta: {
        updateAt: {type:Date, default: Date.now()},
        createAt: {type:Date, default: Date.now()}
    },
    children: [ chapterInfoSchema],    //子节点,是chapterSchema类型的数组
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User' 
    }
});


moocSchema.pre('save', function (next) {
    if(this.isNew) {
        this.meta.createAt = this.meta.updateAt = Date.now();
    }else{
        this.meta.updateAt = Date.now();
    }
    next();
})

module.exports = mongoose.model('Mooc', moocSchema);