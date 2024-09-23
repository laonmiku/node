var mysql = require('mysql');

var config = {
    connectionLimit: 100,
    host: 'localhost',
    user: 'bookbang',
    password: 'pass',
    database: 'bookbangdb',
    port: 3306 // 포트 번호는 숫자입니다
};

var pool=mysql.createPool(config);
var connection;

exports.connect = function(){
    pool.getConnection(function(err, con){
        if(err){
            console.log('db접속 오류:', err);
        }else{
            connection=con;
            console.log('접속성공');
        }
    });
}

exports.get = function(){
    return connection;
}