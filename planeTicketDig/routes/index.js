var express = require('express');
var router = express.Router();



/* GET home page. */
router.get('/', function (req, res, next) {

})

router.get('/a', function(req, res, next) {
  superAgent.get('https://cnodejs.org')
      .end(function (err, sres) {
        if(err){
          return next(err);
        }
        var $ = cheerio.load(sres.text);
        var items=[];
        
        $('#topic_list .cell').each(function (index , element) {
          var $element = $(element);
          items.push({
            title: $element.find('.topic_title').attr('title'),
            href: url + $element.find('.topic_title').attr('href'),
            author: $element.find('.user_avatar > img').attr('title'),
          })
        })
        if(items){
          res.send(items);
        }
      })

});

module.exports = router;
