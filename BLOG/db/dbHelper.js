var entries = require('./jsonRes');
var mongoose = require('./db.js');
//获取user和news的两个模型
var User = require('./schema/user');
var News = require('./schema/news');
var Visitor = require('./schema/visitor');
var db = mongoose.createConnection('localhost','test');

var webHelper = require('../lib/webHelper');
var async = require('async');
var md = webHelper.Remarkable();
// var markdown = require('markdown').markdown;

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
    //方法一: 如果适用markdown中间件
    // data.content = markdown.toHTML(data.content);  //对content内容进行html的转换
    //方法二: 如果适用remarkable+highlight
    data.content = md.render(data.content);
    // data.content = md.render(data.content);  //用在remarkable里面
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

exports.deleteNews = function (id, cb) {
    News.findById(id, function (err, doc ) {
        if(doc){   //如果找到了记录就删除doc.remove,同时修改entries的信息
            doc.remove(function (err, doc) {
                if (err) {   //删除失败
                    entries.msg = err;
                    cb(false, entries);
                }else {     //成功删除
                    entries.msg = '删除新闻成功!';
                    cb(true, entries);
                }
            });
        }else {
            next(err);
        }
    })
};


//展示新闻函数   非分页展示
// exports.getNews = function (req,cb) {
//     //在News的模型里面找到所有数据,并且对找到的所有结果,执行同一个操作函数
//     //find函数返回的是保存了数据的字符串(数组) 因此如果需要调用数据,要先转变成对象
//     News.find()
//         .sort({"meta.createAt": -1})
//         .populate('author')
//         .exec(function (err,docs) {
//         //定义一个数组,用来保存数据
//         var newsList = new Array();
//         for(var i=0; i<docs.length; ++i ){
//             //按照次序,把docs转变得到的对象数组,逐个push进入空数组
//             //数组修改器--$push
//             newsList.push(docs[i].toObject());
//         }
//         cb(true,newsList);
//     });
// };

// 原本打算自己用paginator做的部分
// // 分页展示新闻列表
// exports.getNews = function (req,cb){
//     var page= 1;
//     console.log(page);
//     // var page = $('#page-box .active').innerText;
//     var queryPage = page || 1;
//     console.log(queryPage);
//     // var queryPage= req.query.page || 1;   //需要查询的页面页码
//     this.pageQuery(2, 3, News, 'author', {}, {created_time:'desc'},function (err,data) {
//     // this.pageQuery(queryPage, 5, News, 'author', {}, {created_time:'desc'},function (err,data) {
//         if(err){
//             next(err);
//             //如果出错,就把error传进next,并且转到下一个路由中去
//         }else{
//             cb(true,data);
//         }
//     });
// };


exports.getNews = function(req, cb) {
    // 获取查询url中的page变量
    var page = req.query.page || 1 ;  //req.query.page是封装属性,默认为0
    //此函数中的this应该指window
    this.pageQuery(page, 5, News, 'author', {}, {
        created_time: 'desc' //以created_time为基准,降序排列
    }, function(error, data){
        if(error){
            next(error);
        }else{
            // console.log(data.results)
            cb(true,data);
        }
    });

};



exports.pageQuery = function (page, pageSize, Model, populate, queryParams, sortParams, callback) {
    var start = (page - 1) * pageSize;
    var $page = {
        pageNumber: page
    };
    //并行执行多个函数，每个函数都是立即执行，不需要等待其它函数先执行。传给最终callback的数组中的数据按照tasks中声明的顺序，而不是执行完成的顺序。 如果某个函数出错，则立刻将err和已经执行完的函数的结果值传给parallel最终的callback。其它未执行完的函数的值不会传到最终数据，但要占个位置。 同时支持json形式的tasks，其最终callback的结果也为json形式。
    async.parallel({
        count: function (done) {  // 查询数量
            Model.count(queryParams).exec(function (err, count) {
                done(err, count);
            });
        },
        records: function (done) {   // 查询一页的记录
            Model.find(queryParams).skip(start).limit(pageSize).populate(populate).sort(sortParams).exec(function (err, doc) {
                done(err, doc);
            });
        }
    }, function (err, results) {
        //count函数和records函数调用的结果,按照函数声明的顺序(如果全部调用),或者使用"."角标保存到results中(数组形式,所以可以调用length)
        //输出当前列表,保存到newList数组中
        var newsList=new Array();
        for(var i=0;i<results.records.length;i++) {
            newsList.push(results.records[i].toObject());
        }

        var count = results.count;   //保存新闻记录总条数
        // 把属性保存进$page变量中,输出到外部
        // $page.pageCount = parseInt((count - 1) / pageSize + 1);  //保存新闻总页数
        // count-1的目的是避免出现最后一页记录为空
        //除法结果加1的目的是在最后一页记录条数未填满时,仍然显示
        $page.pageCount = parseInt((count -1 ) / pageSize +1 );  //保存新闻总页数
        $page.results = newsList;    //新闻记录对象数组
        $page.count = count;
        callback(err, $page);
    });
};

//单条博客的readmore
exports.getOneNews = function (req, id ,cb) {
    News.findOne({_id: id})  
        .exec(function (err,docs) {
            var docs = (docs != null)?docs.toObject():'';
            cb(true, docs);
        });
};




//访问登记模块

//保存游客访问记录
exports.addVisitor = function (data, cb) {
    var visitor = new Visitor({
        visitorName : data.visitorName,
        visitorID: data.visitorID,
    });
    visitor.save(function(err, doc){
        if (err){
            cb(false,err);
        }else {
            cb(true,entries);   
        }
    });
}


//游客记录计数
//
// exports.countVisitor = function (req, cb) {
//     var count = function(done){
//         Visitor.count().exec(function(err, countV){
//             done(err,countV);
//         });
//     }
//     cb(true,count);
// };
// exports.getCount2 = function (req ,cb) {
//     var count = Visitor.count().exec();
//     console.log('count is' + count);
//     // alert('一共'+ count +' 人');
//     cb(true, count);
// }

exports.getCount = function (req ,cb ) {

    var $visitor = {
        // pageNumber: page
    };
    async.parallel({
        count: function (done) {  // 查询数量
            Visitor.count().exec(function (err, count) {
                done(err, count);
            });
        },
    }, function (err, results) {
        //count函数和records函数调用的结果,按照函数声明的顺序(如果全部调用),或者使用"."角标保存到results中(数组形式,所以可以调用length)
        //输出当前列表,保存到newList数组中
        var count = results.count;   //保存新闻记录总条数
        $visitor.count = parseInt(count/2);
        cb(err, $visitor);
    });
}