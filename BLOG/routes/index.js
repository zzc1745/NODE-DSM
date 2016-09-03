var express = require('express');
var router = express.Router();
var dbHelper = require('../db/dbHelper');

var fs = require('fs');
var NodePDF = require('nodePDF');


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
    
    dbHelper.getOneNews(req, id, function (success, data) {
        res.render('blog', {
            layout:'admin',
            entry: data
        });
    });
});

router.get('PDF2/:id', function (req, res, next) {
    var id = req.params.id;
    var host = req.protocol + '://' + req.get('host')
    
})

router.get('PDF/:id', function (req, res, next) {

    var id = req.params.id;
    var host = req.protocol + '://' + req.get('host') + '/pdf/blogPdf/' + id;
    var pdffile = '\\pdf\\news-' + Date.now() + '.pdf';

    // res.render('./admin/newsCreate', { title: 'Express', layout: 'admin' });

    NodePDF.render(host, pdffile, function(err, filePath){
        if (err) {
            console.log(err);
        }else{
            // console.log(filePath);
            fs.readFile(pdffile , function (err,data){   //此行代码有问题
                res.contentType("application/pdf");
                res.send(data);
            });
        }
    });
})




// 渲染登陆界面
router.get('/login', function(req,res,next) {
    res.render('login',{ title: 'Express', layout:'lg'});
});
// post方式获取数据完成验证
router.post('/login', function(req, res, next) {
    dbHelper.findUsr(req.body, function (success, doc) {
        req.session.user = doc.data;
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

//查看浏览器发送到服务器的信息
router.get('/headers',function (req,res) {
    res.set('Content-Type','text/plain');
    var s = '';
    for( var name in req.headers)
        s += name + ':' + req.headers[name] + '\n';
    res.send(s);
})




module.exports = router;
