var express = require('express');
var router = express.Router();
var db = require('../db');

/*도서등록*/
router.post('/insert', function(req, res, next) {
  const title=req.body.title;
  const price=req.body.price;
  const contents=req.body.contents;
  const isbn=req.body.isbn;
  const publisher=req.body.publisher;
  const author=req.body.authors;
  const image=req.body.thumbnail;
  //console.log(title,price,contents,isbn,publisher,author,image);

  const sql='select * from books where isbn=?';
  db.get().query(sql, [isbn], function(err, rows){
    if(rows.length==0){
      const sql1='insert into books(title,price,contents,isbn,publisher,author,image) values(?,?,?,?,?,?,?)';
      db.get().query(sql1, [title,price,contents,isbn,publisher,author,image], function(err, rows){
        if(err){
          console.log('err.............', err);
          res.send({result:0})
        }else {
          res.send({result:1});
        }
      })
    }else{
      res.send({result:0});
    }
  });  
});

/*도서목록 테스트:/books/list?page=1&size=5*/
router.get('/list', function(req, res){
  const page = parseInt(req.query.page);
  const size = parseInt(req.query.size);
  let sql = "select *, date_format(regDate, '%Y-%m-%d-%T') fmtdate, format(price, 0) fmtprice"; 
      sql += " from books";
      sql += " order by bid desc";
      sql += " limit ?, ?;";

  db.get().query(sql, [(page-1)*size, size], function(err, rows){
      const documents = rows;
      sql = "select count(*) total from books";
      db.get().query(sql, function(err, rows){
          const count = rows[0].total;
          res.send({count, documents});
      });
  })
});

/*도서삭제*/
router.post('/delete', function(req, res){
  const bid=req.body.bid;
  const sql=" delete from books where bid=? ";
  db.get().query(sql, [bid], function(err,rows){
    if(err){
      res.send({result:0});
    }else{
      res.send({result:1});
    }
  });
});


module.exports = router;