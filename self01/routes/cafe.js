var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index.ejs', { title: '애견카페💕' ,  pageName:'cafe.ejs'});
});

module.exports = router;
