var express = require('express');
var router = express.Router();
var dbHelper = require('../db/dbHelper');
var formidable = require('formidable');
var entries = require('../db/jsonRes');

/* GET users listing. */
router.get('/addNews',function(req,res,next){
  res.render('./admin/addNews',{ title:'Express', layout:'admin'});
});
router.post('/addNews',function(req,res,next){
  dbHelper.addNews(req.body, function (success, doc){
    res.send(doc);
  })
});

//post方法获取图片
router.post('/uploadImg', function (req, res, next) {
  var io = global.io;    //用来监听前台的进程
  
  var form = new formidable.IncomingForm();  //创建Formidable.IncomingForm对象
  var path= "";
  var fileds = [];

  //配置文件上传参数
  form.encoding = 'utf-8';    //设置表单域的编码
  form.uploadDir = "upload";  //设置上传文件存放的文件夹，如不设置默认为系统的临时文件夹
  form.keepExtensions = true; //使得上传的文件保持原来的文件的扩展名
  form.maxFieldsSize = 300 * 1024 * 1024; //限制所有存储表单字段域的大小（除去file字段），如果超出，则会触发error事件，
  
  form.parse(req);  //转换请求中所包含的表单数据

  form.on('field', function (field, value) {
      console.log(field + ":" + value);
  })
      .on('file', function (field, file) {
    path = '\\' + file.path;
          // 此处犯过一个错误:在callback参数中,把file误写成value,导致file.path为错误内容,因此导致不能在textarea区域内插入引用图片的代码
  })
      .on('end',function () {
          console.log("upload done!");
          entries.code = 0;
          entries.data = path;
          res.writeHead(200,{
              'content-type': 'text/json'
          });
          res.end(JSON.stringify(entries));
          console.log(JSON.stringify(entries));
          // {"code":0,"data":"\\upload/upload_ae493682ed5e1a2481108a3248595c3f.png","msg":""}
      });
  
});

router.get('/newsList', function (req, res, next) {

    var msg = req.session['message'] || '';
    req.session['message'] = "";
    
    dbHelper.getNews(req, function (success,docs) {
        res.render('./admin/newsList', {
            layout: 'admin',
            entries: docs.results,
            pageCount:docs.pageCount,
            pageNumber:docs.pageNumber,
            count:docs.count,
            message: msg
        });
    });
});

router.get('/delete/:id', function (req, res, next) {
    var id = req.params.id;   //不理解这里的id是怎么获取到的  解答:是从路由中得到的,解析req中的参数
    // 那么路由中的:id怎么得到的? 
    // 路由中的id,来自于每一条新闻在获取为entries时,对应的id,在newsList.hbs文件中获取
    dbHelper.deleteNews(id, function (success, data) {
        req.session['message'] = data.msg;   //用来弹出"删除成功"的提示
        //Cannot set property 'message' of undefined
        res.redirect("/admin/newsList");  //在该路由下完成删除函数后跳转回到原来页面
    });
});

router.get('/reg',function(req,res,next){
  res.render('./reg',{title: 'Express', layout :'reg'});
});
router.post('/reg',function (req,res,next){
  dbHelper.addUser(req.body, function (success, doc) {
    res.send(doc);
  })
});

module.exports = router;