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
        if($(e.target).hasClass("upload_btn")) {
            var postnum = $(e.target).attr('postnum');
            var key = '.comment_contents' + postnum
            var contents = $(key).val();
            console.log(contents);
            
            $.ajax({
                url: '/matstagram/post/comment',
                type: 'POST',
                data:{contents:contents, postnum:postnum},
                success: function(result){
                    console.log(result);
                    var comment_key = '.post' + postnum;
                    console.log(comment_key);
                    $(comment_key).append(
                        '<div class="comment_container">'
                            +'<div class="comment" id="comment-list-ajax-post37">'
                                +'<div class="comment-detail">'
                                    +'<div class="nick_name m_text">' + result.nickname + '</div>'
                                    +'<div>' + result.contents + '</div>'
                                +'</div>'
                            +'</div>'                 
                        +'</div>'
                    );

                    $(key).val('');
                }, error: function(req, status, error){
                    console.log(error);
                }
            })
        }    
    });
  });