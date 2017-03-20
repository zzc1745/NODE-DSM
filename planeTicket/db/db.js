var mongoose = require('mongoose');
mongoose.Promise = Promise;

console.log('建立mongoose连接...');

mongoose.connect('mongodb://127.0.0.1:27017/airTicket');

mongoose.connection.on('connected', function(){
    console.log('mongoose default connection open to:' + 'mongodb:127.0.0.1:27017/airTicket');
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

process.on('exit', function() {
    mongoose.connection.close(function() {
        console.log('mongoose default connection disconnected through the app termination');
        process.exit(0);
    })
});

module.exports = mongoose;
