var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/blog', function(req, res, next) {
  res.render('blog', { title: 'Express' , layout:'main'} );
});
router.get('/login', function(req,res,next) {
    res.render('login',{ title: 'Express', layout:'lg'});
});



module.exports = router;
