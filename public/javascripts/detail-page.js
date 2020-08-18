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
    });

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
        var postnum = $(e.target).attr('postnum');
        $.ajax({
            url: '/matstagram/post/' + postnum,
            type: 'GET',
            success: function(result) {
                var post = result.post;
                var user = result.user
                var login = result.login;
                if(user === "비로그인"){
                    $(".modal-content").empty();
                    alert("로그인을 해주세요!");
                    modal.style.display = "none";
                    return;
                } else {
                var uploadtime = new Date(post.uploadtime).format("yyyy-MM-dd(KS) a/p hh:mm:ss");
                // 모달창을 비워줌
                $(".modal-content").empty();
                // 이미지와 유저정보를 보여주는 부분
                $(".modal-content").append(
                    '<div class="img_section">'
                        +'<div class="trans_inner">'
                            +'<div>'
                                +'<img src="/userdata/posts/' + post.postnum + '.png" alt="">'
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
                                +'<ul id="toggle" class="more_detail">'
                                // 작성자와 로그인유저에 따라 팔로우 / 수정,삭제 를 보여주도록 함
                                +'</ul>'
                            +'</div>'
                        +'</header>'
                        +'<section class="scroll_section">'
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
                        // 좋아요 여부에 따라 하트 모양 변경 - 조건문
                    +'</div>')

                        

                    $(".detail--right_box").append(
                         '<div class="count_likes">좋아요 <span class="count">'+ post.likes.length +'</span>개</div>'
                        // +'<div class="timer">'+'2시간'+'</div>'

                        +'<div class="commit_field">'
                            +'<input type="text" placeholder="댓글달기..">'

                            +'<div class="upload_btn">게시</div>'
                        +'</div>'

                    )

                    // 조건문들
                    var chklikes = 'N';
                    for(var prop in post.likes){
                        if(post.likes[prop].usernum == login.usernum){
                            chklikes = 'Y';
                        }
                    }
                    
                    if(chklikes == 'N'){
                        $(".detail--right_box").append('<div class="bottom_icons">'
                        +'<div class="left_icons">'
                            +'<div class="heart_btn">'
                                +'<div postnum="' +post.postnum + '" class="sprite_heart_icon_outline" data-name="heartbeat">'+'</div>'
                            +'</div>'
                            // 멘션/북마크 부분 일단 삭제
                            // +'<div>'
                            //     +'<div class="sprite_bubble_icon">'+'</div>'
                            // +'</div>'
                            +'<div>'
                                +'<div class="sprite_share_icon" data-name="share">'+'</div>'
                            +'</div>'
                        +'</div>'

                        // +'<div class="right_icon">'
                        //     +'<div class="sprite_bookmark_outline" data-name="book-mark">'+'</div>'
                        // +'</div>'
                        +'</div>')
                    } else {
                        $(".detail--right_box").append('<div class="bottom_icons">'
                        +'<div class="left_icons">'
                            +'<div class="heart_btn">'
                                +'<div postnum="' +post.postnum + '" class="sprite_heart_icon_outline hearton" data-name="heartbeat">'+'</div>'
                            +'</div>'
                            // 멘션/북마크 부분 일단 삭제
                            // +'<div>'
                            //     +'<div class="sprite_bubble_icon">'+'</div>'
                            // +'</div>'
                            +'<div>'
                                +'<div class="sprite_share_icon" data-name="share">'+'</div>'
                            +'</div>'
                        +'</div>'

                        // +'<div class="right_icon">'
                        //     +'<div class="sprite_bookmark_outline" data-name="book-mark">'+'</div>'
                        // +'</div>'
                        +'</div>')
                    }
                    
                    if(user.id == login.id){
                        $(".more_detail").append(
                            '<li onclick="location.href=`/matstagram/post/'+post.postnum +'/edit`">수정</li>'
                            +'<li onclick="location.href=`/matstagram/post/'+post.postnum +'/delete`">삭제</li>'

                        )
                    } else {
                        $(".more_detail").append(
                            '<li>팔로우</li>'
                        )
                    }
                }
                modal.style.display = "block";
           }, error: function(req, status, error){
                console.log(error);
            }
        });
    })
});

