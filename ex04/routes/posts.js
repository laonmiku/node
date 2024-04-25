var express = require('express');
var router = express.Router();
var db=require('../db');

/* 게시판 목록페이지로 이동 */
router.get('/', function(req, res, next) {
    res.render('index.ejs', { title: '게시판', pageName : 'posts/list.ejs' });
});

//게시판목록 데이터 불러오기
router.get('/list.json',function(req,res){//여기다르면 404
    //const sql='select * from posts order by pid desc';//최신순정렬
    const sql='SELECT pid, title, contents, writer, date_format(pdate,"%Y-%m-%d-%T") fdate from posts order by pid desc';
    //list.ejs에서 이치문 출력을 이제 fdate로 바꿔주면됨,,,
    db.get().query(sql,function(err, rows){
        if(err){
            console.log("게시판 목록:",err);
        }else{
            res.send(rows);
        }
    }); //err,rows는 내가 맘대로지정해줘도 됨!
});

//글쓰기 페이지로 이동
router.get('/insert',function(req,res){
    res.render('index.ejs',{title:'글쓰기',pageName:'posts/insert.ejs'});
});



//글쓰기(DB에 저장)
router.post('/insert',function(req,res){ 
    //function(1,2) 이거 매개변수인거니까 위치가 중요함!!
    const title=req.body.title; //요청받은자료//보내기1
    const contents=req.body.contents;
    const uid=req.body.uid;
    console.log(title,contents,uid);
    const sql="insert into posts(title,contents,writer) values (?,?,?)";
    db.get().query(sql,[title,contents,uid], function(err,rows){
        if(err){
            console.log('글쓰기오류',err);
        }
        res.redirect('/posts'); //포스트스 리스트로 이동//전송하기2
    });
    
});

//게시글누르면 링크로이동 read
router.get('/read',function(req,res){
    //?로 get으로 넘겨줄때는 바디가아니라 쿼리에있음,,포스트는 바디엿음!
    const pid = req.query.pid;
    console.log(pid);
    const sql='select *, date_format(pdate,"%Y-%m-%d-%T") fdate from posts where pid=? order by pid desc';
    db.get().query(sql,[pid],function(err,rows){
        console.log(rows[0]);
        res.render('index.ejs',{
            title:'게시글정보',
            pageName:'posts/read.ejs',
            poster:rows[0]    
        });
    });
    //res.render('index.ejs',{title:'게시글정보',pageName:'posts/read.ejs'});
});


module.exports = router;