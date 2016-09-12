var express = require('express');
var router = express.Router();
var dbHelper = require('../db/dbHelper');
var config = require('../config');


// 渲染登陆界面
router.get('/', function(req,res,next) {
    res.render('login',{ title: 'Express', layout:'lg'});
});
// post方式获取数据完成验证
router.post('/', function(req, res, next) {
    dbHelper.findUsr(req.body, function (success, doc) {
        req.session.user = doc.data;
        // res.send(doc);
    });
    dbHelper.addVisitor(req.body, function (success , docs) {
        res.send(docs);
    });
});


router.get('/logout',function (req, res, next) {
    req.session.user = null;
    res.redirect('/');
});


//导出pdf时,因权限问题,因此给该页面添加副本(为展示)
router.get('/blogPDF/:id', function (req, res, next) {
    var id = req.params.id;
    config.news.path = id;
    dbHelper.getOneNews(req , id, function (success, data) {
        dbHelper.findReviews(req , function (success, result) {
            res.render('pdf-blog',{
                entry: data,
                layout:null,
            });
        })
    });
    //显示该新闻的所属评论

});




module.exports = router;