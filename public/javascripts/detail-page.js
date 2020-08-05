$(document).ready(function () {    
    // Get the modal
    var modal = document.getElementById('myModal');
     
    // Get the button that opens the modal
    var btn = document.getElementById("detail-page");                                 
    
    // When the user clicks on the button, open the modal 
    btn.onclick = function() {
        modal.style.display = "block";
    }
    
    // When the user clicks anywhere outside of the modal, close it
    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }

    $(document).on('click', '.pic', function(e){
        console.log('눌러짐');
        var data = $(e.target).attr('data');
        console.log(data.writerid);

        modal.style.display = "block";
    })
});

