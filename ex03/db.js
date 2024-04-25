var mysql=require('mysql');
var config={
    connectionLimit:100,
    host:'localhost',
    user:'node',
    password:'pass',
    database:'nodedb',
    port:'3306'
}
var pool=mysql.createPool(config);
var connection;

exports.connect = function(){
    pool.getConnection(function(err,con){
        if(err){
            console.log('db접속오류',err)
        }else{
            connection=con;
            console.log('접속성공');
        }
    });
}
//어플리케이션이 시작돨떄 한번만하면댐,,
//그래서 어플리케이션 실행시 제일처음실행되는 app에다가 저장할고임

exports.get = function(){
    return connection;
}
//커넥션객체를 리턴