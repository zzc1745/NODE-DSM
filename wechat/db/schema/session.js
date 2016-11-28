var mongoose  = require('../db.js');
var Schema  = mongoose.Schema;

var msgSchema =  new Schema({
    sender: String,
    receiver: String,
    msgContent: String,
    type : String,
    createAt: {type:Date, default: Date.now()}
});

var sessionSchema = new Schema({
    // user1是小id,user2是大id
    user1: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    user2: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    status: String,
    //该会话的聊天消息数组
    chatHistory: [msgSchema],
    meta: {
        createAt: {type:Date, default: Date.now()},
        lastChatAt: {type:Date, default: Date.now()}
    }
})


sessionSchema.pre('save', function (next) {
    if(this.isNew) {
        this.meta.createAt = this.meta.lastChatAt = Date.now();
    }else{
        this.meta.lastChatAt = Date.now();
    }
    next();
})

module.exports = mongoose.model('Session', sessionSchema);
