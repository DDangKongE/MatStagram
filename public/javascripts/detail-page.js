$(document).ready(function () {   
    
    $('html').on('click', function(e) { 
        // 포스트 설정버튼
        if($(e.target).hasClass("sprite_more_icon")) {
            if($("#toggle").css("display") == "none"){   
                jQuery('#toggle').css("display", "block");   
            } else {  
                jQuery('#toggle').css("display", "none");   
            }
        } else if(!$(e.target).hasClass("sprite_more_icon")){
            jQuery('#toggle').css("display", "none");
        }
        
        // 좋아요
        if($(e.target).hasClass("sprite_heart_icon_outline")) {
            var postnum = $(e.target).attr('postnum');
            var element_o = $(".hearton");
            $.ajax({
                url: '/matstagram/post/like/' + postnum,
                type: 'POST',
                success: function(result) {
                    var count = $('.count').text();
                    if(element_o.attr('class')==undefined){
                        $(e.target).attr('class','sprite_heart_icon_outline hearton');
                        $('.count').text(++count);
                    } else {
                        $(e.target).attr('class','sprite_heart_icon_outline');
                        $('.count').text(--count);
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
            var chkfollow = $("#follow").text();
            var fdata = {"follow": follow, "follower": follower};
            $.ajax({
                url: '/matstagram/follow',
                type: 'POST',
                data: fdata,
                success: function(result) {
                    var count = $('#followers').text();
                    if(chkfollow == "팔로우"){
                        $('.follow').text("언팔로우");
                        $('#followers').text(++count);
                    } else if (chkfollow == "언팔로우"){
                        $('.follow').text("팔로우");
                        $('#followers').text(--count);
                    }
               }, error: function(req, status, error){
                    console.log(error);
                }
            });
        }
    });

    // 코멘트 남기기
    $(document).on('click', '.upload_comment', function(e){
        console.log('ee');
        var contents = $('.comment_contents').val();
        var postnum = $('.comment_contents').attr('postnum');
        
        $.ajax({
            url: '/matstagram/post/comment',
            type: 'POST',
            data:{contents:contents, postnum:postnum},
            success: function(result){
                if(result.err == "err"){
                    return;
                } else {
                    $(".scroll_section").append(
                        '<div class="user_container-detail">'
                        +'<div class="user">'+'<img src="/userdata/profile/' + result.usernum + '.png" alt="user">'+'</div>'
                        +'<div class="comment">'
                        +'<span class="user_id">'+ result.nickname +'</span>' + result.contents
                        +'<div class="time">1초 전<span class="try_comment">댓글 삭제</span>'+ '</div>'
                        +'</div>'
                        );
                        
                        $('.comment_contents').val('');
                    }
                }, error: function(req, status, error){
                    console.log(error);
            }
        })
    });
});