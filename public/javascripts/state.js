$(document).ready(function(){
    $.getJSON("/movie/fetch_states",function(data){
        data.data.map((item)=>{
            $('#state').append($('<option>').text(item.statename).val(item.stateid))
        })
    })

    $('#state').change(function(){
        $.getJSON("/movie/fetch_city",{stateid:$('#state').val()},function(data){
            $('#city').empty()
            $('#city').append($('<option>').text("-Select City-"))
            data.data.map((item)=>{
                $('#city').append($('<option>').text(item.cityname).val(item.cityid))
            })
        })
    })

    
    $('#city').change(function(){
            $.getJSON("/movie/fetch_cinema",{cityid:$('#city').val()},function(data){
            $('#cinema').empty()
            $('#cinema').append($('<option>').text("-Select Cinema-"))
            data.data.map((item)=>{
                $('#cinema').append($('<option>').text(item.cinemaname).val(item.cinemaid))
            })
        })
    })

})