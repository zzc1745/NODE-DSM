var mongoose  = require('../db');
var Schema = mongoose.Schema;


/*用户定义*/
var userSchema;
userSchema = new Schema({
    username: String,
    password: String,
    sexual: Boolean,
    imgUrl: {type:String, default:"/public/me2.png"},
    meta: {
        createAt : { type:Date, default: Date.now()},
        lastLoginAt : { type:Date, default: Date.now()},
    }
});

userSchema.pre('save', function (next) {
    if (this.isNew) {
        this.meta.createAt = this.meta.lastLoginAt = Date.now();
    }else{
        this.meta.lastLoginAt = Date.now();
    }
    next();
})

module.exports = mongoose.model('User', userSchema);
