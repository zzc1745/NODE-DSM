var mongoose = require("../db");
var Schema = mongoose.Schema;

var answerSchema = new Schema({
    studentNo:String,
    questionNo:String,
    answer:String,
    score: {type:Number, default: 0},
    meta: {
        updateAt: {type:Date, default: Date.now()},
        createAt: {type:Date, default: Date.now()}
    },
    testName:String
});

answerSchema.pre('save', function (next) {
    if (this.isNew) {
        this.meta.createAt = this.meta.updateAt = Date.now();
    } else {
        this.meta.updateAt = Date.now();
    }
    next();
})

module.exports = mongoose.model('Answer', answerSchema);

