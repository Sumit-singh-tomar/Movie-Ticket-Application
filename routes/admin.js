var express=require('express')
var router=express.Router()
var pool=require('./pool');
const { rmSync } = require('fs');
var LocalStorage=require('node-localstorage').LocalStorage;
localStorage=new LocalStorage('./scratch')

function checkAdminSession()
{
    try{
        var admin=JSON.parse(localStorage.getItem('ADMIN'))
        if(admin=='null')
        {
            return false
        }
        else{
            return admin
        }
    }
    catch(e){
        return false
    }
}

router.get('/loginpage',function(req,res,next){
    var userdata=checkAdminSession()
    if(userdata)
    {
        res.render('dashboard',{data:userdata})
    }
    else
    {
      res.render('loginpage',{msg:''})
    }
})


router.post('/check_login',function(req,res,next){
    pool.query("select * from admins where (emailid=? or mobileno=?) and password=?",[req.body.email,req.body.email,req.body.pwd],function(error,result){
        if(error)
        {
            res.render('loginpage',{msg:'Database Error'})
        }
        else
        {
            if(result.length==1)
            {
                res.render('Dashboard',{data:result[0]})
                localStorage.setItem('ADMIN',JSON.stringify(result[0]))
            }            
            else
            {   
                res.render('loginpage',{msg:'Invalid Email/Password'})
            }
        }
    })
})


router.get('/user_register',function(req,res,next){
    res.render('user_register',{msg:''})
})

router.post('/user_registration_submit',function(req,res,next){
if(req.body.result=='1')
{
    pool.query("insert into admins (emailid, mobileno, adminname, picture, password)values(?,?,?,?,?)",[req.body.email,req.body.mobileno,req.body.user,req.body.picture,req.body.pwd],function(error,result){
        if(error)
        {
            res.render('user_register',{msg:'User already Exist'})
        }
        else
        {
            res.render('user_register',{msg:'Registration Successful'})
        }
    })
}
else
{
    pool.query("insert into admins (emailid, mobileno, adminname, password)values(?,?,?,?)",[req.body.email,req.body.mobileno,req.body.user,req.body.pwd],function(error,result){
        if(error)
        {
            res.render('user_register',{msg:'User already Exist'})
        }
        else
        {
            
            res.render('user_register',{msg:'Registration Successful'})
        }
    })
}
})

router.get('/logout',function(req,res,next){
    localStorage.clear()
    res.redirect('loginpage')
    
})
module.exports=router