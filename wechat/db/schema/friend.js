var mongoose  = require('../db.js');
var Schema  = mongoose.Schema;

var friendSchema =  new Schema({
    me:{
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    friend: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    unread : {type:Number, default: 0},
    meta: {
        createAt: {type: Date, default: Date.now()},
        lastChatAt : { type:Date, default: Date.now()}
    }
});


friendSchema.pre('save', function (next) {
    if (this.isNew) {
        this.meta.createAt = this.meta.lastChatAt = Date.now();
    }else{
        this.meta.lastChatAt = Date.now();
    }
    next();
})

module.exports = mongoose.model('Friend', friendSchema);
