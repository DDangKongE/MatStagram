const tapContainer = document.querySelector('.about');
const flex_Container = document.querySelectorAll('.contents_container');
const taps = document.querySelectorAll('.about > span');


function openCity(e){
    let elem = e.target;
    
    for (var i = 0; i < flex_Container.length; i++) {
        flex_Container[i].classList.remove('active');
        taps[i].classList.remove('on');
    }
    
    if(elem.matches('[class="nick_name"]')){
        
        flex_Container[0].classList.add('active');
        taps[0].classList.add('on');
        
    }else if(elem.matches('[class="like"]')){
        
        flex_Container[1].classList.add('active');
        taps[1].classList.add('on');
    }else if(elem.matches('[class="book_mark"]')){
        
        flex_Container[2].classList.add('active');
        taps[2].classList.add('on');
        
    }
    
    

}


tapContainer.addEventListener('click', openCity);

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

    // Get the modal
    var modal = document.getElementById('myModal');
    
    // When the user clicks anywhere outside of the modal, close it
    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }
    
    // 팔로워 리스트 확인
    $(document).on('click', '.followercount', function(e){
        var usernum = $(e.target).attr('fuser');
        modal.style.display = "block";
        $.ajax({
            url: '/matstagram/follow',
            type: 'GET',
            data:{"type":"follower" ,"usernum":usernum},
            success: function(result){
                if(result.Followers == "비로그인"){
                    modal.style.display = "none";
                } else {
                    var UserData = result.Followers;
                    // 모달창을 비워줌
                    $(".modal-content").empty();
                    // 이미지와 유저정보를 보여주는 부분
                    $(".modal-content").append(
                        '<table class="table" style="text-align: center;">'
                        +'<thead>'
                        +'<tr>'
                        +'<th scope="col">사진</th>'
                        +'<th scope="col">닉네임</th>'
                        +'<th scope="col">이름</th>'
                        +'<th scope="col">프로필</th>'
                        +'</tr>'
                        +'</thead>'
                        +'<tbody class="table_data">'
                        
                        +'</tbody>'
                        +'</table>'
                        );
                        for(let prop in UserData){
                            $(".table_data").append(
                                '<tr>'
                                +'<td style="vertical-align: middle;"><img src="/userdata/profile/' + UserData[prop].usernum + '.png"  width="75" height="75" style="border-radius: 50%;"></td>'
                                +'<td style="vertical-align: middle;">' + UserData[prop].usernickname + '</td>'
                                +'<td style="vertical-align: middle;">' + UserData[prop].username + '</td>'
                                +'<td style="vertical-align: middle;"><button type="button" class="btn btn-secondary" usernickname="' + UserData[prop].usernickname 
                                + '" onclick="javascript:window.location.href=`/matstagram/profile/' + UserData[prop].usernickname + '`">놀러가기</button></td>'
                                +'</tr>'
                                
                                );
                            }
                        }
                        }, error: function(req, status, error){
                            console.log(error);
                        }
                    })
                });

                // 팔로우 리스트 확인
    $(document).on('click', '.followcount', function(e){
        modal.style.display = "block";
        var usernum = $(e.target).attr('fuser');
        $.ajax({
            url: '/matstagram/follow',
            type: 'GET',
            data:{"type":"follow" ,"usernum":usernum},
            success: function(result){
                if(result.Followers == "비로그인"){
                    modal.style.display = "none";
                } else {
                    var UserData = result.Follows;
                    // 모달창을 비워줌
                    $(".modal-content").empty();
                    // 이미지와 유저정보를 보여주는 부분
                    $(".modal-content").append(
                        '<table class="table" style="text-align: center;">'
                            +'<thead>'
                                +'<tr>'
                                +'<th scope="col">사진</th>'
                                +'<th scope="col">닉네임</th>'
                                +'<th scope="col">이름</th>'
                                +'<th scope="col">프로필</th>'
                                +'</tr>'
                            +'</thead>'
                            +'<tbody class="table_data">'
                                
                            +'</tbody>'
                            +'</table>'
                    );
                    for(let prop in UserData){
                        $(".table_data").append(
                            '<tr>'
                                +'<td style="vertical-align: middle;"><img src="/userdata/profile/' + UserData[prop].usernum + '.png"  width="75" height="75" style="border-radius: 50%;"></td>'
                                +'<td style="vertical-align: middle;">' + UserData[prop].usernickname + '</td>'
                                +'<td style="vertical-align: middle;">' + UserData[prop].username + '</td>'
                                +'<td style="vertical-align: middle;"><button type="button" class="btn btn-secondary" usernickname="' + UserData[prop].usernickname 
                                + '" onclick="javascript:window.location.href=`/matstagram/profile/' + UserData[prop].usernickname + '`">놀러가기</button></td>'
                            +'</tr>'

                        );
                    }
                }
            }, error: function(req, status, error){
                console.log(error);
            }
        })
    });

    // 코멘트 남기기
    $(document).on('click', '.upload_comment', function(e){
        var contents = $('.comment_contents').val();
        var postnum = $('.comment_contents').attr('postnum');
        console.log(contents);
        
        $.ajax({
            url: '/matstagram/post/comment',
            type: 'POST',
            data:{contents:contents, postnum:postnum},
            success: function(result){
                if(result.err == "err"){
                    return;
                } else {
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
                }
            }, error: function(req, status, error){
                console.log(error);
            }
        })
    });

    // 포스트 상세보기
    $(document).on('click', '.pic', function(e){
        modal.style.display = "block";
        var postnum = $(e.target).attr('postnum');
        $.ajax({
            url: '/matstagram/post/' + postnum,
            type: 'GET',
            success: function(result) {
                var post = result.post;
                var user = result.user;
                var login = result.login;
                var chkfollow = $("#follow").text();
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
                                    +'<img src="/userdata/profile/' + user.profileimg + '" alt="" onclick="location.href=`/matstagram/profile/'+ user.usernickname +'`">'
                                +'</div>'
                                +'<div class="user_name">'
                                    +'<div class="nick_name" onclick="location.href=`/matstagram/profile/'+ user.usernickname +'`">'+user.usernickname+'</div>'
                                    +'<div class="country" onclick="window.open(`https://place.map.kakao.com/'+ post.placeid +'`)" style="cursor:pointer">'+post.placename+ '<br>(' + post.addressname + ')' +'</div>'
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
                                +'<div class="admin">'+'<img src="/userdata/profile/' + user.profileimg + '" alt="user" onclick="location.href=`/matstagram/profile/'+ user.usernickname +'`">'+'</div>'
                                +'<div class="comment">'
                                    +'<span class="user_id" onclick="location.href=`/matstagram/profile/'+ user.usernickname +'`">'+user.usernickname+'</span>'+post.contents
                                    +'<div class="hashtags" style="margin-top: 5px; font-size:12px;"></div>'
                                    +'<div class="time">'+uploadtime+'</div>'
                                +'</div>'
                            +'</div>'
                        +'</section>'
                        // 좋아요 여부에 따라 하트 모양 변경 - 조건문
                    +'</div>')

                        

                    $(".detail--right_box").append(
                         '<div class="count_likes">좋아요 <span class="count">'+ post.likes.length +'</span>개</div>'

                        +'<div class="commit_field">'
                            +'<input class="comment_contents" type="text" postnum="' + post.postnum + '" placeholder="댓글달기..">'
                            +'<input type="hidden" value="dd">'

                            +'<button class="btn btn-success btn-sm btn-block upload_comment">댓글 등록</button>'
                        +'</div>'


                        // +'<form name="unfollow" action="/matstagram/follow/' + user.usernum + '" method="POST" style="display:none;">'
                        // +'<input type="hidden" name="follower" value="' + login.usernum + '" />'
                        // +'<input type="hidden" name="chk" value="' + chkfollow + '" />'
                        // +'</form>'
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
                            +'<div>'
                                +'<div class="sprite_share_icon" data-name="share">'+'</div>'
                            +'</div>'
                        +'</div>'


                        +'</div>')
                    } else {
                        $(".detail--right_box").append('<div class="bottom_icons">'
                        +'<div class="left_icons">'
                            +'<div class="heart_btn">'
                                +'<div postnum="' +post.postnum + '" class="sprite_heart_icon_outline hearton" data-name="heartbeat">'+'</div>'
                            +'</div>'
                            +'<div>'
                                +'<div class="sprite_share_icon" data-name="share">'+'</div>'
                            +'</div>'
                        +'</div>'
                        +'</div>')
                    }
                    
                    if(user.id == login.id){
                        $(".more_detail").append(
                            '<li onclick="location.href=`/matstagram/post/'+post.postnum +'/edit`">수정</li>'
                            +'<li onclick="location.href=`/matstagram/post/'+post.postnum +'/delete`">삭제</li>'

                        )
                    } else {
                        if(chkfollow == "팔로우"){
                            $(".more_detail").append(
                                '<li class="follow" follower="' + login.usernum + '" follow="' + user.usernum + '">팔로우</li>'
                            )
                        } else {
                            $(".more_detail").append(
                                '<li class="follow" follower="' + login.usernum + '" follow="' + user.usernum + '">언팔로우</li>'
                                
                            )
                        }
                    }

                    for(var prop in post.comments){
                        var uploadcomments = new Date(post.comments[prop].uploadtime).format("yyyy-MM-dd(KS) HH:mm:ss");
                        $(".scroll_section").append(
                            '<div class="user_container-detail">'
                            +'<div class="user">'+'<img src="/userdata/profile/' + post.comments[prop].usernum + '.png" alt="user" onclick="location.href=`/matstagram/profile/'+ post.comments[prop].nickname +'`">'+'</div>'
                            +'<div class="comment">'
                                +'<span class="user_id" onclick="location.href=`/matstagram/profile/'+ post.comments[prop].nickname +'`">'+ post.comments[prop].nickname +'</span>' + post.comments[prop].contents
                                +'<div class="time">'+ uploadcomments +'<span class="try_comment">댓글 삭제</span>'+ '</div>'
                            +'</div>'
                        );
                    }

                    for(let tag in post.hashtags) {
                        $(".hashtags").append('<a href="/matstagram/explore/' + post.hashtags[tag].tag.match(/[^#]+/g) + '">' + post.hashtags[tag].tag + ' &nbsp;</a>')
                    }
                }
                modal.style.display = "block";
           }, error: function(req, status, error){
                console.log(error);
            }
        });
    })
});

