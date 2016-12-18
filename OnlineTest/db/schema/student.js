var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var studentSchema = new Schema({
    userNo:String,
    userName:String,
    userPwd:String,
    status:{type:String, default: "offline"},
    meta:{
        updateAt:{type:Date, default: Date.now()},
        createAt:{type:Date, default: Date.now()}
    }
})

studentSchema.pre('save', function (next) {
    if(this.isNew) {
        this.meta.createAt = this.meta.updateAt = Date.now();
    }else {
        this.meta.updateAt = Date.now();
    }
    next();
})

module.exports = mongoose.model("Student", studentSchema);

