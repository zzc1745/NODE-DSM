var express = require('express');
var router = express.Router();
var dbHelper = require('../db/dbHelper');

var mongoose = require('mongoose');
var db = mongoose.createConnection('localhost','test');
db.on('error',console.error.bind(console,'连接错误:'));
db.once('open',function(){
    //一次打开记录
    mongoose.connect('mongodb://127.0.0.1:27017/test');
    var Schema = mongoose.Schema;
    var blogSchema = new Schema({
        title:  String,
        author: String,
        body:   String
    });
    var Blog = mongoose.model('Blog', blogSchema);

    var personSchema = new Schema({
        name: String,
        password: String
    });
    var person = mongoose.model('person',personSchema);
    
});


/* GET home page. */
router.get('/blog', function(req, res, next) {
  res.render('blog', { title: 'Express' , layout:'main'} );
    // person.find(function(err,persons){
    //     console.log(persons)
    // });
});
router.get('/login', function(req,res,next) {
    res.render('login',{ title: 'Express', layout:'lg'});
});
router.post('/login', function(req, res, next) {
    dbHelper.findUsr(req.body, function (success, doc) {
        res.send(doc);
    })
});

//新建一个页面,暂时用来更新数据入库
router.get('/user', function(req,res,next) {
    var User = require('../db/schema/user');
    var user = new User({
        username: 'anna',
        password: 'a'
    })

    user.save(function (err, doc){

        if(err) {
            console.log(err);
        }

    });

});

module.exports = router;
