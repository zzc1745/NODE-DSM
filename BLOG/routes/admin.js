var express = require('express');
var router = express.Router();
var dbHelper = require('../db/dbHelper');

/* GET users listing. */
router.get('/an', function(req, res, next) {
  res.send('respond with a resource');
});
//   mongoose.connect('mongodb://127.0.0.1:27017/test');
//   var Schema = mongoose.Schema;
//
//   var blogSchema = new Schema({
//     title:  String,
//     author: String,
//     body:   String
//   });
//
//   var Blog = mongoose.model('Blog', blogSchema);
//
//   blog = new Blog({
//     title: 'aaa',
//     author: 'bbb',
//     body:   'ccc'
//   });
//
//   blog.save(function(err, doc) {
//     if (err) {
//       console.log('error')
//     } else {
//       console.log(doc)
//     }
//   });
//
//
// });

router.get('/news',function(req,res,next){
  res.render('aB',{ title:'Express', layout:'addBlog'});
});

router.post('/news',function(req,res,next){
  dbHelper.addNews(req,body, function (success, doc){
    res.send(doc);
  })
});

module.exports = router;
