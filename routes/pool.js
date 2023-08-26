var mysql=require('mysql')
var pool=mysql.createPool({
    host:'localhost',
    port:3306,
    user:'root',
    database:'movieticket',
    password:'root123',
    connectionLimit:100,
    multipleStatements:true
})
module.exports=pool