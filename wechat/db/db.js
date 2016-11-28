var mongoose = require('mongoose');
var config = require('../config')
//获取config中的数据库信息
console.log('建立mongoose连接...');

mongoose.connect(config.db.url);


// 用代码测试连接情况，确保连通。
mongoose.connection.on('connected', function(){
    console.log('mongoose default connection open to:' + config.db.url);
})


mongoose.connection.on('error', function(err){
    console.log('mongoose 连接错误' + err);
})

mongoose.connection.on('disconnected', function(){
    console.log('mongoose 断开连接...');
})


process.on('SIGNIT', function() {
    mongoose.connection.close(function() {
        console.log('mongoose default connection disconnected through the app termination');
        process.exit(0);
    })
})

module.exports = mongoose;
