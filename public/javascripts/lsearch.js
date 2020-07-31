$(document).ready(function () {
    $("#LSearch").click(function() {
        console.log(document.getElementsByName("location_name").value)
        var query = document.getElementsByName("location_name").value;
        $.ajax({
            url: 'http://localhost:3000/matstagram/post/new/lsearch',
            dataType: 'json',
            type: 'POST',
            success: function(result) {
                if (result) {
                  console.log(result);
                }
           }
        });
    })
    
    // Get the modal
    var modal = document.getElementById('myModal');
     
    // Get the button that opens the modal
    var btn = document.getElementById("LSearch");
    
    // Get the <span> element that closes the modal
    var span = document.getElementsByClassName("close")[0];                                          
    
    // When the user clicks on the button, open the modal 
    btn.onclick = function() {
        modal.style.display = "block";
    }
    
    // When the user clicks on <span> (x), close the modal
    span.onclick = function() {
        modal.style.display = "none";
    }
    
    // When the user clicks anywhere outside of the modal, close it
    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }
});

