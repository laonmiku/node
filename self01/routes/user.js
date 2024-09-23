var express = require('express');
var router = express.Router();
var db = require('../db');

router.get('/', function(req, res, next) {
  res.render('index.ejs', { title: '도서 검색', pageName:'book/search.ejs' });
});

//로그인페이지이동
router.get('/login', function (req, res) {
    res.render('index.ejs', { title: '로그인', pageName: 'user/login.ejs' });
});

//마이페이지로 이동
router.get("/mypage", function(req, res){
    const uid=req.query.uid;
    const sql="select * from user where uid=?";
    db.get().query(sql, [uid], function(err, rows){
        res.render('index.ejs',{
            title:"마이페이지",
            pageName:"user/mypage.ejs",
            user:rows[0]     
        });
    });
});

//로그인체크
router.post('/login', function (req, res) {
    const uid = req.body.uid;
    const upass = req.body.upass;
    console.log(uid, upass);
    const sql="select * from user where uid=?";
    db.get().query(sql, [uid], function(err, rows){
        if(err){
            console.log('에러:', err);
            return;
        }
        console.log(rows[0]);
        let result=0;
        if(rows[0]){
            if(rows[0].upass==upass){
                result=1;
            }else{
                result=2;
            }
        }
        res.send({result:result});
    });
});


//update
router.post('/update', function(req, res){
    const uid=req.body.uid;
    const uname=req.body.uname;
    const phone=req.body.phone;
    const age=req.body.age;
    const sql='update user set uname=?,phone=?,age=? where uid=?';
    db.get().query(sql,[uname,phone,parseInt(age),uid], function(err, rows){
      if(err){
        res.send({result:0});
      }else{
        res.send({result:1});
      }
    });
  });
module.exports = router;