$(document).ready(function () {
    $(".sprite_more_icon").click(function (){
        if($("#toggle").css("display") == "none"){   
            jQuery('#toggle').css("display", "block");   
        } else {  
            jQuery('#toggle').css("display", "none");   
        }
    });
    $('html').click(function(e) { if(!$(e.target).hasClass("sprite_more_icon")) 
        if($("#toggle").css("display") == "block"){   
            jQuery('#toggle').css("display", "none");   
        } 
    });
    $(".sprite_heart_icon_outline").click(function(){
        var element_o = $(".hearton");
        if(element_o.attr('class')==undefined){
            $(this).attr('class','sprite_heart_icon_outline hearton');
        } else {
            $(this).attr('class','sprite_heart_icon_outline');
        }
    });
  });