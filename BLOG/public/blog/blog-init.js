$(init);

function init() {
    var username = $.cookie('username');
    console.log(username);
    $(".user-info-name").text(username);
    $("#html").text(username);
    $(".user-welcome").click(
        function(){
            if($(".user-info").css("display")=="none"){
                $(".user-info").fadeIn(500);
            }else {
                $(".user-info").fadeOut(500);
            }
        })
};