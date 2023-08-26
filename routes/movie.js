var express=require('express')
var router=express.Router()
var pool=require("./pool")
var upload=require("./multer")
var fs=require("fs")

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

router.get('/movieinterface',function(req,res,next){
    if(checkAdminSession())
        res.render('movieinterface',{viewstatus:0})
    else
        res.redirect('/admin/loginpage')
})

router.get('/fetch_states',function(req,res,next){
    pool.query("select * from states",function(error,result){
        if(error)
        {
            res.json({message:'fail',staus:false,data:[]})
        }
        else
        {
            res.json({message:'success',status:true,data:result})
        }
    })
})

router.get('/fetch_city',function(req,res,next){
    pool.query("select * from city where stateid=?",[req.query.stateid],function(error,result){
        if(error)
        {
            res.json({message:'fail',staus:false,data:[]})
        }
        else
        {
            res.json({message:'success',staus:true,data:result})
        }
    })
})

router.get('/fetch_cinema',function(req,res,next){
    pool.query("select * from cinema where cityid=?",[req.query.cityid],function(error,result){
        if(error)
        {
            res.json({message:'fail',staus:false,data:[]})
        }
        else
        {
            res.json({message:'success',staus:true,data:result})
        }
    })
})

router.post('/record_submit',upload.single("poster"),function(req,res,next){
    pool.query("insert into movieinfo(moviename,movietype,date,format,description,state,city,cinema,poster)values(?,?,?,?,?,?,?,?,?)",[req.body.moviename,req.body.movietype,req.body.date,req.body.format,req.body.description,req.body.state,req.body.city,req.body.cinema,req.file.filename],function(error,result){
    if(error)
    {
        res.render('movieinterface',{viewstatus:1})
    }
    else
    {    
        res.render('movieinterface',{viewstatus:2})
    }
    })
})

var forsearchbutton
router.get('/display_records',function(req,res,next){
    pool.query("select movieinfo.*,city.cityname,states.statename,cinema.cinemaname from movieinfo,city,states,cinema where movieinfo.state=states.stateid and movieinfo.city=city.cityid and movieinfo.cinema=cinema.cinemaid",function(error,result){
        if(error)
        {
            res.render('displayrecords',{message:'fail',status:0,data:[]})
        }
        else
        {   
            console.log('result is : ',result)
            forsearchbutton=result
            res.render('displayrecords',{message:'success',status:1,data:result})
        }
    })
})

router.get('/for_searchbutton',function(req,res,next){
    res.json({data:forsearchbutton})
})


var foreditradiobutton
router.get('/data_for_edit_record',function(req,res,next){
pool.query("select movieinfo.*,city.cityname,states.statename,cinema.cinemaname from movieinfo,city,states,cinema where movieinfo.state=states.stateid and movieinfo.city=city.cityid and movieinfo.cinema=cinema.cinemaid and movieinfo.movieid=?",[req.query.mid],function(error,result){
        if(error)
        {   
            res.render('editrecord',{data:[],msg:0})
        }
        else
        {  
            foreditradiobutton=result[0]
            res.render('editrecord',{data:result[0],msg:1})
            
        }
    })
})

router.get('/edit_record_for_radiobutton',function(req,res,next){
        res.json({data:foreditradiobutton})
})

router.get('/searchmovie',function(req,res,next){
    pool.query("select movieinfo.*,city.cityname,states.statename,cinema.cinemaname from movieinfo,city,states,cinema where movieinfo.state=states.stateid and movieinfo.city=city.cityid and movieinfo.cinema=cinema.cinemaid and movieinfo.movieid=?",[req.query.mid],function(error,result){
        if(error)
        {
            res.render('displayrecords',{data:[],status:2})
        }
        else
        {
            res.render('displayrecords',{data:result,status:3})
        }
    })
})


router.post('/update_record',function(req,res,next){
    if(req.body.btn=="Edit")
    { 
        pool.query("update movieinfo set moviename=?,movietype=?,date=?,format=?,description=?,state=?,city=?,cinema=? where movieid=?",[req.body.moviename,req.body.movietype,req.body.date,req.body.format, req.body.description, req.body.state, req.body.city, req.body.cinema,req.body.movieid],function(error,result){
        if(error)
        {   console.log('error is : ',error)
            res.render('editrecord',{msg:2})
        }
        else
        { 
            res.render('editrecord',{msg:3}) 
        }
        })
    }
    if(req.body.btn=="Delete")
    {
        pool.query("delete from movieinfo where movieid=?",[req.body.movieid],function(error,result){
            if(error)
            {
                res.render('editrecord',{msg:4})
            }
            else
            {
                fs.unlinkSync(`public/images/${req.body.oldposter}`)
                res.render('editrecord',{msg:5})
            }
        })
    }
})

router.get('/edit_poster',function(req,res,next){
    res.render('edit_poster',{data:req.query})
})

router.post('/edit_poster_submit',upload.single('newposter'),function(req,res,next){
    console.log("req.body is : ",req.body)
    pool.query("update movieinfo set poster=? where movieid=?",[req.file.filename,req.body.movieid],function(error,result){
        if(error)
        {
            res.redirect('display_records')
        }
        else
        {
            fs.unlinkSync(`public/images/${req.body.oldposter}`)
            res.redirect('display_records')
        }
    })
})

router.get('/view_all_records',function(req,res,next){
    pool.query("select bookticket.*,city.cityname,states.statename,cinema.cinemaname from bookticket,city,states,cinema where bookticket.state=states.stateid and bookticket.city=city.cityid and bookticket.cinema=cinema.cinemaid",function(error,result){
        if(error)
        {
            res.render('view_all_records',{data:[]})
        }
        else
        {   
            res.render('view_all_records',{data:result})
        }
    })
})

var storemovie
router.get('/view_poster_detail',function(req,res,next){
    pool.query("select bookticket.*,city.cityname,states.statename,cinema.cinemaname from bookticket,city,states,cinema where bookticket.state=states.stateid and bookticket.city=city.cityid and bookticket.cinema=cinema.cinemaid and bookticket.movieid=?",[req.query.movieid],function(error,result){
        if(error)
        {
            res.render('clickonposter',{data:[]})
        }
        else
        {   
            storemovie=result[0]
            res.render('clickonposter',{data:result[0]})
        }
    })
})

router.get('/book_ticket',function(req,res,next){
    res.render('bookticket',{data:storemovie,msg:0})
})


router.get('/book_ticket_submission',function(req,res,next){
    res.render('bookticket',{msg:1,item:req.query})
})

router.get('/book_ticket_view',function(req,res,next){
    res.render('ticketslip',{data:storemovie,item:req.query})
})
module.exports=router