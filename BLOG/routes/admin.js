var express = require('express');
var router = express.Router();
var dbHelper = require('../db/dbHelper');


/* GET users listing. */
router.get('/news',function(req,res,next){
  res.render('./admin/news',{ title:'Express', layout:'admin'});
});
router.post('/news',function(req,res,next){
  dbHelper.addNews(req.body, function (success, doc){
    res.send(doc);
  })
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