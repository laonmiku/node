var express = require('express');
var router = express.Router();
var db = require('../db'); //db를 찾기위해

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index.ejs', { title: '회사소개', pageName : 'home.ejs' });
});

//로그인
router.get('/login', function(req, res, next) {
  res.render('index.ejs', { title: '로그인', pageName : 'users/login.ejs' });
});

//로그인체크
router.post('/login', function(req, res){
  const uid = req.body.uid;
  const upass = req.body.upass;
  console.log(uid, upass);
  const sql = "select * from users where uid=?";
  db.get().query(sql, [uid], function(err, rows){
    if(err){
      console.log('에러:', err);
      return;
    }
      console.log(rows[0]);
      let result = 0;
      if(rows[0]) { //아이디값이 존재할때
        if(rows[0].upass==upass) {//비밀번호가 일치할때
          result=1;
        }
        else{
          result=2;
        }
      }
      //console.log({result});
      res.send({result});
    });
  });

module.exports = router;