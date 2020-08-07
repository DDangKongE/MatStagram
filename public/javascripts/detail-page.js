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
        var nickname = $(e.target).attr('nickname');
        var postNum = $(e.target).attr('postNum');
        $.ajax({
            url: '/matstagram/profile/' + nickname + '/' + postNum,
            type: 'POST',
            success: function(result) {
                var post = result.result;
                var user = result.user
                if(user === "비로그인"){
                    alert("로그인을 해주세요!");
                    return 0;
                } else {
                var uploadtime = new Date(post.uploadtime).format("yyyy-MM-dd(KS) a/p hh:mm:ss");
                // 모달창을 비워줌
                $(".modal-content").empty();
                // 이미지와 유저정보를 보여주는 부분
                $(".modal-content").append(
                     '<div class="img_section">'
                        +'<div class="trans_inner">'
                            +'<div>'
                                +'<img src="/userdata/posts/' + post.postNum + '.png" alt="">'
                            +'</div>'
                        +'</div>'
                    +'</div>'
                    +'<div class="detail--right_box">'
                        +'<header class="top">'
                            +'<div class="user_container">'
                                +'<div class="profile_img">'
                                    +'<img src="/userdata/profile/' + user.profileimg + '" alt="">'
                                +'</div>'
                                +'<div class="user_name">'
                                    +'<div class="nick_name">'+user.usernickname+'</div>'
                                    +'<div class="country">'+post.placename+ '<br>(' + post.addressname + ')' +'</div>'
                                +'</div>'
                            +'</div>'
                            +'<div class="sprite_more_icon" data-name="more">'
                                +'<ul class="more_detail">'
                                    +'<li>팔로우</li>'
                                    +'<li>수정</li>'
                                    +'<li>삭제</li>'
                                +'</ul>'
                            +'</div>'
                        +'</header>')

                        // 포스트 내용과 댓글을 표시하는 영역
                        $(".modal-content").append('<section class="scroll_section">'
                            +'<div class="admin_container">'
                                +'<div class="admin">'+'<img src="/userdata/profile/' + user.profileimg + '" alt="user">'+'</div>'
                                +'<div class="comment">'
                                    +'<span class="user_id">'+user.usernickname+'</span>'+post.contents
                                    +'<div class="time">'+uploadtime+'</div>'
                                +'</div>'
                            +'</div>'

                            +'<div class="user_container-detail">'
                                +'<div class="user">'+'<img src="/userdata/profile/0.png" alt="user">'+'</div>'
                                +'<div class="comment">'
                                    +'<span class="user_id">'+'댓글단 아이디'+'</span>'+'이게 댓글이 제대로 입력이 되는건지 모르겠네 진짜루 하나도 모르겠네'
                                    +'<div class="time">'+ '댓글달린 시간' +'<span class="try_comment">답글 달기</span>'+'</div>'
                                    +'<div class="icon_wrap">'
                                        +'<div class="more_trigger">'
                                            +'<div class="sprite_more_icon">'+'</div>'
                                        +'</div>'
                                        +'<div>'
                                            +'<div class="sprite_small_heart_icon_outline">'+'</div>'
                                        +'</div>'
                                    +'</div>'
                                +'</div>'
                            +'</div>'
                        +'</section>'

                        +'<div class="bottom_icons">'
                            +'<div class="left_icons">'
                                +'<div class="heart_btn">'
                                    +'<div class="sprite_heart_icon_outline" data-name="heartbeat">'+'</div>'
                                +'</div>'
                                +'<div>'
                                    +'<div class="sprite_bubble_icon">'+'</div>'
                                +'</div>'
                                +'<div>'
                                    +'<div class="sprite_share_icon" data-name="share">'+'</div>'
                                +'</div>'
                            +'</div>'

                            +'<div class="right_icon">'
                                +'<div class="sprite_bookmark_outline" data-name="book-mark">'+'</div>'
                            +'</div>'
                        +'</div>'

                        +'<div class="count_likes">좋아요 <span class="count">'+'2,351'+'</span>개</div>'
                        +'<div class="timer">'+'2시간'+'</div>'

                        +'<div class="commit_field">'
                            +'<input type="text" placeholder="댓글달기..">'

                            +'<div class="upload_btn">게시</div>'
                        +'</div>'
                    +'</div>'
                    )
                }
                modal.style.display = "block";
           }, error: function(req, status, error){
                console.log(error);
            }
        });
    })
});

