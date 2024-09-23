var express = require('express');
var router = express.Router();
var db = require('../db');  // db 모듈 불러오기

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index.ejs', { title: '홈페이지' ,  pageName:'home.ejs'});
});

/* 인서트 */
router.get('/insert', function (req, res, next) {
    res.render('index.ejs', { title: '후기 작성하기', pageName: 'review/insert.ejs' });
});

router.post('/insert', function(req, res){
  const title=req.body.title;
  const contents=req.body.contents;
  const uid = req.body.uid;
  const bid = req.body.bid;
  console.log(title, contents, uid);
  const sql="insert into review (title,contents,uid,bid,regDate) values(?,?,?,?,now())";
  db.get().query(sql, [title, contents, uid,bid], function(err, rows){
      if(err){
          console.log('글쓰기 오류:', err);
      }
      res.redirect('/book');
  });
});

/* 리스트 */
router.get('/list', function (req, res, next) {
  res.render('index.ejs', { title: '후기모아보기', pageName: 'review/list.ejs' });
});
router.get('/list.json', function(req, res){
  const sql='select *,date_format(regDate, "%Y-%m-%d %T") fmtDate  from review order by rid desc';
  db.get().query(sql, function(err, rows){
      if(err){
          console.log('게시판목록:', err);
      }else{
          res.send(rows);
      }
  });
});
/* 리드 */
router.get('/read', function(req, res){
  const rid=req.query.rid;
  const sql='select *,date_format(regDate, "%Y-%m-%d %T") fmtDate  from review where rid=?';
  db.get().query(sql, [rid], function(err, rows){
      console.log(rows[0]);
      res.render('index.ejs', 
          {
              title:'리뷰게시글정보', 
              pageName:'review/read.ejs',
              review:rows[0]
          });
  })
});

/* 수정 */
router.post('/update', function(req, res){
  const rid=req.query.rid;
  const title=req.body.title;
  const contents=req.body.contents;
  const sql='update review SET title = ?, contents = ?, uDate = NOW() WHERE rid = ?';
  db.get().query(sql, [title,contents,rid], function(err, rows){
    if (err) {
      console.error('Update Error:', err);
      return res.status(500).json({ success: false, message: 'Update failed' });
  }
    res.json({ success: true });
  })
});


module.exports = router;