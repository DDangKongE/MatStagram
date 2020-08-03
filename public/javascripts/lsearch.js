$(document).ready(function () {
    $("#LSearch").click(function() {
        console.log($("#place_name").val())
        var query = $("#place_name").val();
        $.ajax({
            url: 'https://dapi.kakao.com/v2/local/search/keyword.json?query=' + query,
            headers: { 'Authorization': 'KakaoAK 68c7c9c7a3927feacd295e792bd0f585'},
            type: 'GET',
            success: function(result) {
                var data = result.documents;
                if (result.documents.length !== 0) {
                    $("#modal-content").empty();
                    $("#modal-content").append("<div style='padding-bottom:30px; padding-top: 10px;'>검색 결과 " + result.documents.length + "건</div>")
                    for(var prop in data){
                        $("#modal-content").append("<div class='modal-data'><p id='data" + prop + "' place_id='" + data[prop].id + "' place_name='" + data[prop].place_name + "' address_name='" + data[prop].address_name + "'>" 
                        + data[prop].place_name + "<br>" + data[prop].address_name 
                        + "</p></div>")
                    }
                } else {
                    $("#modal-content").empty();
                    $("#modal-content").append("검색 결과가 없습니다.")
                }
           }, error: function(req, status, error){
                $("#modal-content").empty();
                $("#modal-content").append("검색 결과가 없습니다.")
            }
        });
    })
    
    // Get the modal
    var modal = document.getElementById('myModal');
     
    // Get the button that opens the modal
    var btn = document.getElementById("LSearch");                                    
    
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

    $(document).on('click', '.modal-data', function(e){
        var place_id = $(e.target).attr('place_id');
        var place_name = $(e.target).attr('place_name');
        var address_name = $(e.target).attr('address_name');

        $("input[type=hidden][name=place_id]").val(place_id);
        $("input[type=text][name=place_name]").val(place_name);
        $("input[type=text][name=address_name]").val(address_name);

        modal.style.display = "none";
    })
});

