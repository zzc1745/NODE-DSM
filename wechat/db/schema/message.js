var mongoose  = require('../db.js');
var Schema  = mongoose.Schema;

var messageSchema =  new Schema({
    sender:{
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    receiver: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    msgContent: String,
    readStatus : String,
    meta:{
        createAt: {type:Date, default: Date.now()},
        updateAt: {type:Date, default: Date.now()}
    }

});


messageSchema.pre('save', function (next) {
    if(this.isNew) {
        this.meta.createAt = this.meta.updateAt = Date.now();
    }else{
        this.meta.updateAt = Date.now();
    }
    next();
})

module.exports = mongoose.model('Message', messageSchema);
