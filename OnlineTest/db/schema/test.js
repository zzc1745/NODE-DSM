var mongoose = require("../db");
var Schema =  mongoose.Schema;

var questionSchema = new Schema({
    questionNo:Number,
    statement: String,
    answer: String,
    value: Number,
    meta: {
        updateAt: {type:Date, default: Date.now()},
        createAt: {type:Date, default: Date.now()}
    }
});

var testSchema  = new Schema({
    subjectName: String,
    teacher: String,
    startTime: String,
    lastTime: Number,
    children: [questionSchema],
    meta: {
        updateAt: {type:Date, default: Date.now()},
        createAt: {type:Date, default: Date.now()}
    }
});

testSchema.pre('save', function (next) {
    if(this.isNew) {
        this.meta.createAt = this.meta.updateAt = Date.now();
    }else{
        this.meta.updateAt = Date.now();
    }
    next();
})

module.exports = mongoose.model('Test', testSchema);
