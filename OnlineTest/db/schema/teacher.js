var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var teacherSchema = new Schema({
    userNo:String,
    userName:String,
    userPwd:String,
    meta:{
        updateAt:{type:Date, default: Date.now()},
        createAt:{type:Date, default: Date.now()}
    }
})

teacherSchema.pre('save', function (next) {
    if(this.isNew) {
        this.meta.createAt = this.meta.updateAt = Date.now();
    }else {
        this.meta.updateAt = Date.now();
    }
    next();
})

module.exports = mongoose.model("Teacher", teacherSchema);

