const express = require('express');
// const mongoose=require("mongoose");
const mysql = require('mysql');
//post请求库
const bodyParser = require("body-parser");
const app = express();




const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'main'
});

connection.connect();
console.log("连接数据库成功");



//使用 body-parser中间件  post
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());



app.get("/", (req, res) => {
    res.send("hello worldd");
})



//查询所有
app.get("/homedata", (req, res) => {
    const sql = 'SELECT * FROM main';
    connection.query(sql, function (err, result) {
        if (err) {
            console.log('[SELECT ERROR] - ', err.message);
            return;
        }
        //成功
        console.log(JSON.stringify(result));
        return res.json(result);
    });
   
})




//搜索模糊查询
app.get("/search", (req, res) => {
    const name=req.query.album_name;
    const sql="SELECT * FROM  main where album_name like '%"+name+"%'";
    console.log(sql);
    connection.query(sql, function (err, result) {
        if (err) {
             res.json("搜索不存在");
            
        }
        //成功
        console.log(JSON.stringify(result));
         res.json(result);
    });
  
})








//分页接口
app.get('/api', function(req, res, next) {
    var current_page = 1; //默认为1
    var num = 2; //一页条数
    if (req.query.page) {
        current_page = parseInt(req.query.page);
    }

    var last_page = current_page - 1;
    if (current_page <= 1) {
        last_page = 1;
    }
    var next_page = current_page + 1;
    var str = 'SELECT left(album_id,50) as date,album_id FROM main limit ' + num + '  offset ' + num * (current_page - 1);
  
     console.log(str);
    
    connection.query(str, function(err, rows, fields) {
        if (err) {
          return   res.send('error数据查询有误');
        }
        if (!err) {
            if (!rows[0]) {
               return  res.send('error已到最后一页,请返回');
            }
           
            res.status(200).send({data:{rows,last_page,next_page,current_page}});

  
        }
    });
  
});


// 设置为可跨域
app.all('*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
    res.header("X-Powered-By",' 3.2.1')
    res.header("Content-Type", "application/json;charset=utf-8");
    next();
});






//端口及其监听
const port = process.env.PORT || 4000;
app.listen(port, () => {
    console.log(port);
})