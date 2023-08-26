$(document).ready(function(){
        $.getJSON("/movie/edit_record_for_radiobutton",function(data){
        if(data.data.format=="2D")
        {
            $('#2d').prop('checked','true')
        }
        if(data.data.format=="3D")
        {
            $('#3d').prop('checked','true')
        }

        var d=new Date(data.data.date)
        var n=`${d.getFullYear()}/${d.getMonth()+1}/${d.getDate()}`
        $('#date').val(n)
       
    })
    var m=0
    var i=0
    var k=0
    $('#movietype').click(function(){
        if(i==0)
        {
            $('#movietype').empty()
            $('#movietype').append($('<option>').text("-Select type-"))
            $('#movietype').append($('<option>').text("Hindi"))
            $('#movietype').append($('<option>').text("English"))
            i=i+1            
        }
    })

    var j=0
    $('#state').click(function(){
        if(j==0)
        {
            $('#state').empty()
            $('#state').append($('<option>').text("-Select State-"))
            $.getJSON("/movie/fetch_states",function(data){
            data.data.map((item)=>{
                $('#state').append($('<option>').text(item.statename).val(item.stateid))
            })
          })
          j++
        }
    })

    $('#state').change(function(){
        k=0
    })
    
    $('#city').click(function(){
        if(k==0)
        {
            $.getJSON("/movie/fetch_city",{stateid:$('#state').val()},function(data){
            $('#city').empty()
            $('#city').append($('<option>').text("-Select City-"))
            data.data.map((item)=>{
                $('#city').append($('<option>').text(item.cityname).val(item.cityid))
            })
            k++
          })
        }
    })

    $('#city').change(function(){
        m=0
    })
    
    $('#cinema').click(function(){
        if(m==0)
        {
            $.getJSON("/movie/fetch_cinema",{cityid:$('#city').val()},function(data){
            $('#cinema').empty()
            $('#cinema').append($('<option>').text("-Select Cinema-"))
            data.data.map((item)=>{
                $('#cinema').append($('<option>').text(item.cinemaname).val(item.cinemaid))
            })
         })
         m++
        }
    })

    $('#date').click(function(){
        $('#date').remove()
    $('#result').append($('<input type="date" class="form-control" id="date" name="date" />'))
    })

})