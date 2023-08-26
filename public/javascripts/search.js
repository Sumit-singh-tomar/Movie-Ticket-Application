$(document).ready(function(){
    $.getJSON("/movie/for_searchbutton",function(data){
    $('#search').keyup(function(){
        var searchmovies=data.data.filter((item)=>{
            return item.moviename.toLowerCase().includes($('#search').val().toLowerCase())
        })
        showlist(searchmovies)
    })
  })
  function showlist(data)
  {
    var htm
    if(data.length==0)
    {
        htm=`<input type="button" class="btn btn-outline-secondary" value="NO RECORD FOUND...." style="width:50%">`
    }
    else
    {
        htm=`<table style="width:50%">`
        data.forEach((obj)=>{
        htm+=`<tr>
                <td><a href="/movie/searchmovie?mid=${obj.movieid}" class="btn btn-outline-secondary" role="button" style="text-decoration:none;width:99%">${obj.moviename}</a></td> 
              </tr>`
        });
        htm+=`</table`
    }
    $('#result').html(htm)
  }

})