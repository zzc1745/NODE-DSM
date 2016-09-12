var express = require('express');
var router = express.Router();
var dbHelper = require('../db/dbHelper');

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
})

module.exports = router;