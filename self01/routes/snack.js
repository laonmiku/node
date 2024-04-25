var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index.ejs', { title: '플렉스💸' ,  pageName:'snack.ejs'});
});

module.exports = router;