var express = require('express');
var router = express.Router();
var dbHelper = require('../db/dbHelper');
var friend = require('../db/schema/friend');

/* GET home page. */
// 登录与注册
router.get('/login', function(req, res, next) {
  res.render('login', { layout: 'lg' });
});

router.post('/loginCheck',function (req, res, next) {
  dbHelper.findUsr(req.body, function (success , doc) {
    req.session.user = doc.data;
    res.send(doc);
  })
})

router.post('/register',function (req, res, next) {
  dbHelper.addUser( req.body, function (success, docs) {
    res.send(docs);
  })
})
// ————————————
//聊天与操作
router.get('/chat',function (req, res, next) {
  dbHelper.getFriendList(req ,function (success, docs) {
    res.render('chat', {
      layout: 'main',
      entries: docs,
    });
  })
});

router.post('/search',function (req,res,next) {
  dbHelper.searchUser(req.body ,function (success, docs) {
    res.send(docs);
  });
})

router.post('/addToFriend/:id', function (req, res, next) {
  var iid  = $.cookie(id);
  var fid = req.params.id;
  dbHelper.addFriend(iid, fid, function (success, data) {
    if (entries.code == 99){
      alert(entries.msg);
    }else{
      alert("添加好友成功");
    }
  });
})

router.post('/getHistory', function (req, res, next) {
  dbHelper.getHistory(req.body, function (success, docs) {
    res.send(docs);
  })
})

//还没用到的上传图片
router.get('/modify', function () {
})


router.post('/chat', function(req, res, next) {
  var io = global.io;
  var form = new formidable.IncomingForm();
  var path = "";
  var fields = [];

  form.encoding = 'utf-8';
  // form.uploadDir = "upload";
  form.uploadDir = "public/profile";
  form.keepExtensions = true;
  form.maxFieldsSize = 30000 * 1024 * 1024;
  console.log("start:upload");

  form.parse(req); //该方法会转换请求中所包含的表单数据，callback会包含所有字段域和文件信息

  form.on('field', function(field, value) {    //每当一个字段/值对已经收到时会触发该事件
      console.log(field + ":" + value);
  })
      .on('file', function(field, file) {     //每当有一对字段/文件已经接收到，便会触发该事件
        path = '\\' + file.path;
        // file.path是图片保持存在图片文件夹内的路径
      })
      .on('end', function() {    //当所有的请求已经接收到，并且所有的文件都已上传到服务器中，该事件会触发。此时可以发送请求到客户端。
        console.log('-> upload done\n');
        entries.code = 0;
        entries.data = path;
        res.writeHead(200, {           // res.writeHead() 向请求的客户端发送响应头。该函数在一个请求内最多只能调用一次，如果不调用，则会自动生成一个响应头。
          'content-type': 'text/json'
        });
        res.end(JSON.stringify(entries));  //格式化输出文件的信息
      })
      .on("err",function(err){    //当上传流中出现错误便会触发该事件，当出现错误时，若想要继续触发request的data事件，则必须手动调用request.resume()方法
        var callback="<script>alert('"+err+"');</script>";
        res.end(callback);//这段文本发回前端就会被同名的函数执行
      })
      .on("abort",function(){   //当用户中止请求时会触发该事件，socket中的timeout和close事件也会触发该事件，当该事件触发之后，error事件也会触发
        var callback="<script>alert('"+ttt+"');</script>";
        res.end(callback);
      });
});


module.exports = router;





