$(document).ready(function(){
    $('#ticket').keyup(function(){
        var p=$('#ticket').val()
        if(p>50)
        {
            var d='Please select under 50 seats'
            p=`${d}`
           
        }
        else
        {
        p=p*350
        }
    
        $('#total').val(p)
    })
})