var express = require('express');
var router = express.Router();
var dbHelper = require('../db/dbHelper');

var fs = require('fs');
var NodePDF = require('nodepdf');
var wkhtmltopdf = require('wkhtmltopdf');
var config = require('../config');


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
router.get('/blog', function (req,res,next) {
    dbHelper.getNews(req, function (success,docs) {
        //res.send(docs); 把原始数据传到页面
        //把docs传回blog.hbs页面
        //回调函数中的docs要和res.render的传出参数docs一致
        // res.render('blog', { entries: docs , layout: 'main'});
        res.render('blogs',{
            entries:docs.results,
            pageCount:docs.pageCount,
            pageNumber:docs.pageNumber,
            count:docs.count
        });
    });
});

//read more页面
router.get('/blogPDF/:id', function (req, res, next) {
    var id = req.params.id;
    config.news.path = id;
    dbHelper.getOneNews(req , id, function (success, data) {
        dbHelper.findReviews(req , function (success, result) {
            res.render('blog',{
                entry: data,
                review: result,
            });
        })
    });
    //显示该新闻的所属评论

});

router.post('/blogPDF/:id', function (req, res, next) {
    // console.log(req.params.id);
    // var blogid = req.params.id;
    // var blogId = blogid.stringify();   //此处获取到的值是":id"字符串
    // var blogId = "577a5d3be61fbe64043a8d70";
    var blogId = config.news.path;
    dbHelper.addReview(req.body, blogId ,function (success, result) {
        res.send(result);
    });
})


//导出PDF  方法一:适用wkhtmltopdf
router.get('/PDF2/:id',function (req, res, next) {
    var id = req.params.id;
    var host = req.protocol + '://' + req.get('host') + '/blogPDF/' + id;

    wkhtmltopdf(host).pipe(fs.createWriteStream('out.pdf'));
    // wkhtmltopdf(host).pipe(res);
});

//导出pdf  套用老师的nodepdf
router.get('/PDF/:id', function (req, res, next) {
    var id = req.params.id;
    var host = req.protocol + '://' + req.get('host') + '/blogPDF/' + id;   //待导出的html页面的路径
    // console.log(host);
    // req.protocol  === http
    // ://
    // req.get('host')  === localhost:3000
    // /blogPDF/
    // id === 577a5c09e26fab5c041b1279
    var pdffile = config.site.path + '/pdf/news-' + Date.now() + '.pdf';          //过渡文件的包含绝对路径的保存文件名
    
    // 可能是路径的问题???????
    //这个问题没有解决,导出pdf的某个div而非全部
    
    //渲染导出pdf的预览页面
    // NodePDF.render('http://www.google.com', 'google.pdf', options, function(err,...));
    // NodePDF.render(host, pdffile, function(err, filePath){
    NodePDF.render('http://www.baidu.com', pdffile, function(err, filePath){
        if (err) {
            console.log(err);
        }else{
            // console.log(filePath);
            fs.readFile( pdffile , function (err,data){
                // 读取pdffile里面的内容,里面的内容就是需要导出的内容
                res.contentType("application/pdf");   //设置导出类型为pdf
                res.send(data);
                // console.log(data);
            });
        }
    });
});






// 渲染登陆界面
router.get('/login', function(req,res,next) {
    res.render('login',{ title: 'Express', layout:'lg'});
});
// post方式获取数据完成验证
router.post('/login', function(req, res, next) {
    dbHelper.findUsr(req.body, function (success, doc) {
        req.session.user = doc.data;
        // res.send(doc);
    });
    dbHelper.addVisitor(req.body, function (success , docs) {
        res.send(docs);
    });
});

router.get('/count', function (req, res, next) {
    dbHelper.getCount(req, function (success, doc) {
        res.render('count', {
            entry: doc.count,
            layout: 'admin',
        });
    });
});

router.get('/count2',function (req,res,next){
    var count = db.getCollection('visitors').count();
    console.log('count is' + count);
    alert('一共'+ count +' 人');
    res.send(count);
});

// router.get()


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

//查看浏览器发送到服务器的信息
router.get('/headers',function (req,res) {
    res.set('Content-Type','text/plain');
    var s = '';
    for( var name in req.headers)
        s += name + ':' + req.headers[name] + '\n';
    res.send(s);
})




module.exports = router;
