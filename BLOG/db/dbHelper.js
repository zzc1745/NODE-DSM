var entries = require('./jsonRes');
var mongoose = require('./db.js');
//获取user和news的两个模型
var User = require('./schema/user');
var News = require('./schema/news');

var webHelper = require('../lib/webHelper');

// var md = webHelper.Remarkable();

//用户登录的查找函数
exports.findUsr = function(data, cb) {

    User.findOne({
        //判别条件
        username: data.usr   //取出data中的usr,在User模块中匹配
    }, function(err, doc) {
        var user = (doc !== null) ? doc.toObject() : '';
        //如果找到记录,doc.toObject() 把json字符串变成对象
        // findone对象的返回值,不是一个对象,在stackoverfolw上有类似问题
        if (err) {
            console.log(err)
        } else if (doc === null) {   //没有找到输入的用户名
            entries.code = 99;
            entries.msg = '用户名错误！';
            cb(false, entries);
        } else if (user.password !== data.pwd) { //有用户名,但密码不匹配
            entries.code = 99;
            entries.msg = '密码错误！';
            cb(false, entries);
        } else if (user.password === data.pwd) { //用户名、密码都能匹配
            entries.data = user;
            entries.code = 0;
            cb(true, entries);
        }
    })
};

//用户注册函数,要求用户名还没有被注册并且两次输入密码相同
exports.addUser = function(data, cb){
    User.findOne({username:data.usr},function (err, doc) {
        // alert('err');
        // alert('验证用户名存在否中');
        var user = (doc !=null)? doc.toObject():'';
        if(doc === null) {
            //如果输入的注册用户名不存在,进入密码校验
            if (data.pwd === data.pwdRepeat) {
                var newUser = new User({
                    username: data.usr,
                    password: data.pwd,
                    email: data.email,
                    address: data.address
                });
                newUser.save(function (err, doc) {
                    if (err) {
                        cb(false, err);
                    } else {
                        cb(true, entries);
                    }
                });
                // alert("真的存进去了!");
            } else {
                entries.code = 99;
                entries.msg = '两次输入的密码不符';
                cb(false, entries);
            }
        }
            //如果该用户名已经存在
            else {
                entries.code = 99;
                entries.msg = '用户名已存在';
                cb(false, entries);
            }
    })
};

//添加新闻函数
exports.addNews = function(data, cb) {
    // data.content = md.render(data.content);
    var news = new News({
        title: data.title,
        content: data.content,
        author:data.id
    });
    news.save(function(err,doc){
        if (err) {
            cb(false,err);
        }else{
            cb(true,entries);
        }
    })
};


//展示新闻函数
exports.getNews = function (req,cb) {
    //在News的模型里面找到所有数据,并且对找到的所有结果,执行同一个操作函数
    //find函数返回的是保存了数据的字符串(数组) 因此如果需要调用数据,要先转变成对象
    News.find().exec(function (err,docs) {
        //定义一个数组,用来保存数据
        var newsList = new Array();
        for(var i=0; i<docs.length; ++i ){
            //按照次序,把docs转变得到的对象数组,逐个push进入空数组
            //数组修改器--$push
            newsList.push(docs[i].toObject());
        }
        cb(true,newsList);
    });
};

