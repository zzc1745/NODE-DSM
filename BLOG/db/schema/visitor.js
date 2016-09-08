var mongoose  = require('../db');
var Schema = mongoose.Schema;

var visitorSchema = new Schema({
    visitorID: String,
    visitorName: String,
    meta: {
        visitAt: {type:Date, default: Date.now()},
        createAt: {type:Date, default: Date.now()}
    },
});


//这里的pre--save其实可以省略
// visitorSchema.pre('save', function (next) {
//     if(this.isNew) {
//         this.meta.visitAt = this.meta.vitisAt = Date.now();
//     }else{
//         this.meta.visitAt = Date.now();
//     }
//     next();
// })


module.exports = mongoose.model('Visitor', visitorSchema);