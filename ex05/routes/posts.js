var express = require('express');
var router = express.Router();
var db = require('../db');

/* 게시판 목록페이지로 이동 */
//라우터뒤에 괄호에잇는건 패스임,,링크창에찍히는거,,!!!!
router.get('/', function (req, res, next) {
    res.render('index.ejs', { title: '게시판', pageName: 'posts/list.ejs' });
});

//게시판목록 데이터 불러오기
router.get('/list.json', function (req, res) {//여기다르면 404
    //const sql='select * from posts order by pid desc';//최신순정렬
    //const page=1;
    const page = req.query.page;
    const size = parseInt(req.query.size);
    const start = (page - 1) * size;
    const query = "%" + req.query.query + "%";
    // const sql = 'SELECT pid, title, contents, writer, date_format(pdate,"%Y-%m-%d-%T") fdate from posts order by pid desc limit 0,5';
    //두줄로쓰려면 컨스트는 값이 바뀌어버리니까 못쓰고 렛으로 해줘야함 뒤에 0,5 부분을 스타트랑 사이즈로 넣어주면됨, 변수니까 ?로,,
    //list.ejs에서 이치문 출력을 이제 fdate로 바꿔주면됨,,,
    let sql = 'select *,date_format(pdate, "%Y-%m-%d %T") fdate '
        sql+= ' from posts ';
        sql+= ' where title like ? or contents like ?';
        sql+= ' order by pid desc limit ?, ?';
    db.get().query(sql, [query,query,start, size], function (err, rows) {//err,rows는 내가 맘대로지정해줘도 됨!
        // if (err) {
        //     console.log("게시판 목록:", err);
        // } else {
        //     res.send(rows); 아래로내려감,,
        // }
        const documents = rows;
        sql="select count(*) total  from posts where title like ? or contents like ?";
        db.get().query(sql,[query,query],function(err,rows){
            const total=rows[0].total;
            res.send({documents,total});
        });
    });
});
//콜백지옥,,

//글쓰기 페이지로 이동
router.get('/insert', function (req, res) {
    res.render('index.ejs', { title: '글쓰기', pageName: 'posts/insert.ejs' });
});



//글쓰기(DB에 저장)
router.post('/insert', function (req, res) {
    //function(1,2) 이거 매개변수인거니까 위치가 중요함!!
    const title = req.body.title; //요청받은자료//보내기1
    const contents = req.body.contents;
    const uid = req.body.uid;
    console.log(title, contents, uid);
    const sql = "insert into posts(title,contents,writer) values (?,?,?)";
    db.get().query(sql, [title, contents, uid], function (err, rows) {
        if (err) {
            console.log('글쓰기오류', err);
        }
        res.redirect('/posts'); //포스트스 리스트로 이동//전송하기2
    });

});

//게시글누르면 링크로이동 read
router.get('/read', function (req, res) {
    //?로 get으로 넘겨줄때는 바디가아니라 쿼리에있음,,포스트는 바디엿음!
    const pid = req.query.pid;
    console.log(pid);
    const sql = 'select *, date_format(pdate,"%Y-%m-%d-%T") fdate from posts where pid=? order by pid desc';
    db.get().query(sql, [pid], function (err, rows) {
        console.log(rows[0]);
        res.render('index.ejs', {
            title: '게시글정보',
            pageName: 'posts/read.ejs',
            poster: rows[0]
        });
    });
    //res.render('index.ejs',{title:'게시글정보',pageName:'posts/read.ejs'});
});

//게시글삭제
router.get('/delete', function (req, res) {
    const pid = req.query.pid;
    console.log(".............삭제번호", pid);
    const sql = "delete from  posts where pid=?";
    db.get().query(sql, [pid], function (err, rows) {
        if (err) {
            console.log("삭제오류:", err);
        }
        res.redirect("/posts");
    });

});

//게시글 수정 페이지로 이동
router.get('/update', function (req, res) {
    const pid = req.query.pid;
    const sql = "select * from posts where pid=?";
    db.get().query(sql, [pid], function (err, rows) {
        if (err) {
            console.log("수정페이지 호출오류:", err);
        }
        const poster = rows[0];
        res.render("index.ejs", {
            title: "게시글 수정",
            pageName: "posts/update.ejs",
            post: poster
        })
    });
});

//데이터 수정
router.post('/update', function (req, res) {
    const pid = req.body.pid;
    const title = req.body.title;
    const contents = req.body.contents;
    console.log(pid, title, contents);
    const sql = "update posts set title=?,contents=?,pdate=now() where pid=?";
    db.get().query(sql, [title, contents, pid], function (err, rows) {
        if (err) {
            console.log("수정등록오류", err)
        }
        res.redirect("/posts");
    });
});



module.exports = router;