var mongoose = require('mongoose');
var Schema = mongoose.Schema;

/*用户定义*/
var userSchema = new Schema({
    username:String,
    password:String,
    email:String,
    address:String,
    meta:{
        updateAt:{type:Date, default: Date.now()},
        createAt:{type:Date, default: Date.now()}
    }
});

//在保存记录前,先检查是否是新的记录
//在保存记录时,自动加入创建时间和更新时间
userSchema.pre('save',function (next) {
    if(this.isNew) {
        //记录为新,创建时间与更新时间都为当前
        this.meta.createAt = this.meta.updateAt = Date.now();
    }else {
        //记录不为新,更新时间改为当前,创建时间不变
        this.meta.updateAt = Date.now();
    }
    next();//通过next()使程序运行能够进入下一步,即save
})

var userModel = mongoose.model('User',userSchema);
// 传入名为User的数据库模型,数据库名字自动变复数
module.exports = userModel;
//该文件对外输出该数据库模型
// 两句话可以缩写成如下:
// module.exports = mongoose.model('User',userSchema);