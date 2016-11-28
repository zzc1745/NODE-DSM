// function windowHeight() {s
//     var de = document.documentElement;
//     return self.innerHeight||(de && de.clientHeight)||document.body.clientHeight;
// }

// //window.onresize是窗口改变大小的时候，因为窗口改变大小，文档的可见高度或宽度会变化。
// window.onload=window.onresize=function(){
//  	var wh=windowHeight();

//  	document.getElementById(“contentWrap”).style.height
//  		 = document.getElementById(“sidebar”).style.height
//  		 = (wh-document.getElementById(“header”).offsetHeight-document.getElementById(“footer”).offsetHeight)+”px”;
// }

//窗口调整触发该函数
window.onresize = function(){
        var len = document.documentElement.clientHeight;
        var chatTitle = document.getElementById("chatting-title").offsetHeight;
        var chatHistory = document.getElementById("chatting-history").offsetHeight;
        document.getElementById("user-box").style.height = len + 'px';
        document.getElementById("left-bottom").style.height = len - 166 + 'px';
        document.getElementById("editing").style.height = len - chatTitle - chatHistory + 'px';
    };

$(document).ready(function(){
		var len = document.documentElement.clientHeight;
        var chatTitle = document.getElementById("chatting-title").offsetHeight;
        var chatHistory = document.getElementById("chatting-history").offsetHeight;
        document.getElementById("user-box").style.height = len + 'px';
        document.getElementById("left-bottom").style.height = len - 166 + 'px';
        document.getElementById("editing").style.height = len - chatTitle - chatHistory + 'px';
        // onclick事件先于click的追加效果   onclick置于页面中，click在js中
        $(".chat-list-btn").click(function(){
            $(".chat-list-btn").css("background-image","url('/public/images/chats2.png')");
            $(".group-list-btn").css("background-image","url('/public/images/friend1.png')");
            $(".friend-list-btn").css("background-image","url('/public/images/me1.png')");
        	$(".chat-list").css("z-index","999");
        	$(".group-list").css("z-index","0");
        	$(".friend-list").css("z-index","0");
        });
        $(".group-list-btn").click(function(){
            $(".chat-list-btn").css("background-image","url('/public/images/chats1.png')");
            $(".group-list-btn").css("background-image","url('/public/images/friend2.png')");
            $(".friend-list-btn").css("background-image","url('/public/images/me1.png')");
        	$(".chat-list").css("z-index","0");
            $(".group-list").css("z-index","999");
            $(".friend-list").css("z-index","0");
        });
        $(".friend-list-btn").click(function(){
            $(".chat-list-btn").css("background-image","url('/public/images/chats1.png')");
            $(".group-list-btn").css("background-image","url('/public/images/friend1.png')");
            $(".friend-list-btn").css("background-image","url('/public/images/me2.png')");
        	$(".chat-list").css("z-index","0");
            $(".group-list").css("z-index","0");
            $(".friend-list").css("z-index","999");
        });

        $(".search-text").focus(function () {
            // $(".search-result").show();
            // $(".search-result").slideDown(1000);
            $(".search-result").fadeIn(1000);
        });
        $(".search-text").blur(function () {
            // setTimeout("$('.search-result').css('display','none'); ",1000);
            $(".search-result").fadeOut(1000);
            // $(".search-result").slideUp(1000);
         });
});
