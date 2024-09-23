// bookRoutes.js

var express = require('express');
var router = express.Router();
var db = require('../db');  // db 모듈 불러오기

// JSON 형식의 요청 본문을 파싱하기 위한 미들웨어
router.use(express.json());

/* 도서 검색 */
router.get('/', function (req, res, next) {
    res.render('index.ejs', { title: '도서 검색', pageName: 'book/search.ejs' });
});

/*도서정보 DB저장 */
router.post('/insert', function(req, res, next){
    const title=req.body.title;
    const price=req.body.price;
    const contents=req.body.contents;
    const isbn=req.body.isbn;
    const publisher=req.body.publisher;
    const author=req.body.authors;
    const image=req.body.image;
    const publishDate = req.body.publishDate;
    console.log(title,price,contents,isbn,publisher,author,image);
    const sql = 'SELECT * FROM book WHERE isbn = ?';
    db.get().query(sql, [isbn], function(err, rows) {
        if (err) {
            // 쿼리 실행 중 오류가 발생했을 때
            console.error('Query Error:', err);
            return res.status(500).send({ error: 'Database query error' });
        }

        if (!rows || rows.length === 0) {
            const sql1 = 'INSERT INTO book (isbn,title, price, publisher, author, image,publishDate,contents) VALUES (?,?,?,? ,?,  ?, ?, ?)';
            db.get().query(sql1, [isbn,title, price,  publisher, author, image,publishDate,contents], function(err, result) {
                if (err) {
                    // 삽입 중 오류가 발생했을 때
                    console.error('Insert Error:', err);
                    return res.status(500).send({ error: 'Database insert error' });
                }
                const lastID = result.insertId; 
                res.send({  result: 1, lastID: lastID}); /*새로운도서저장 */
            });
        } else {
            const  alreadyBook= rows[0]; 
            res.send({ result: 0, lastID: alreadyBook.bid }); 
        }
    });
});
  

module.exports = router;
