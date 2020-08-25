$(document).ready(function () {
    $("[class^=sprite_more_icon]").click(function (){
        var prop = $(this).attr("prop");
        var key = "#toggle"+prop
        if($(key).css("display") == "none"){   
            $(key).css("display", "block");   
        } else {  
            $(key).css("display", "none");   
        }
    });
    $('html').click(function(e) {
        if(!$(e.target).hasClass("sprite_more_icon")){
            $("[id^=toggle]").css("display", "none");  
        }

        // 좋아요
        if($(e.target).hasClass("sprite_heart_icon_outline")) {
            var postnum = $(e.target).attr('postnum');
            var element_o = $(e.target).attr('class');
            console.log(element_o)
            var key = "#count"+postnum
            $.ajax({
                url: '/matstagram/post/like/' + postnum,
                type: 'POST',
                success: function(result) {
                    var count = $(key).text();
                    if(element_o == 'sprite_heart_icon_outline'){
                        $(e.target).attr('class','sprite_heart_icon_outline hearton');
                        $(key).text(++count);
                    } else {
                        $(e.target).attr('class','sprite_heart_icon_outline');
                        $(key).text(--count);
                    }
            }, error: function(req, status, error){
                    console.log(error);
                }
            });
        }

        // 팔로우
        if($(e.target).hasClass("follow")) {
            var follow = $(e.target).attr('follow');
            var follower = $(e.target).attr('follower');
            var fdata = {"follow": follow, "follower": follower};
            $.ajax({
                url: '/matstagram/follow',
                type: 'POST',
                data: fdata,
                success: function(result) {
                    var count = $('#followers').text();
                    if(chkfollow == "팔로우"){
                        $(this).text("언팔로우");
                    } else if (chkfollow == "언팔로우"){
                        $(this).text("팔로우");
                    }
               }, error: function(req, status, error){
                    console.log(error);
                }
            });
        }

    // 코멘트 남기기
    $(document).on('click', '.upload_comment', function(e){
        console.log('ee');
        var contents = $('.comment_contents').val();
        var postnum = $('.comment_contents').attr('postnum');
        console.log(contents);
        
        $.ajax({
            url: '/matstagram/post/comment',
            type: 'POST',
            data:{contents:contents, postnum:postnum},
            success: function(result){
                console.log(result);
                var uploadcomments = new Date(result.uploadtime).format("yyyy-MM-dd HH:mm:ss");
                $(".scroll_section").append(
                    '<div class="user_container-detail">'
                    +'<div class="user">'+'<img src="/userdata/profile/' + result.usernum + '.png" alt="user">'+'</div>'
                    +'<div class="comment">'
                        +'<span class="user_id">'+ result.nickname +'</span>' + result.contents
                        +'<div class="time">'+ uploadcomments +'<span class="try_comment">댓글 삭제</span>'+ '</div>'
                    +'</div>'
                );

                $('.comment_contents').val('');
            }, error: function(req, status, error){
                console.log(error);
            }
        })
    });
    });
  });