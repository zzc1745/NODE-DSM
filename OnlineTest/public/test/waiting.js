var socket;
var _studentNo = $.cookie('userNumber');
var clock = 1;
$(document).ready(function () {
    socket = io();
    socket.emit('login', _studentNo);
    socket.emit('studentLogin', _studentNo);
    $("body").on('click', "#quitUndo", doOffline);
    countDown();
})

//倒计时钟  倒计时结束才显示考试入口
function countDown() {
    var currentTime = new Date();
    var time = $("#st").html();
    var futureTime = new Date(time) ;

    // Calculate the difference in seconds between the future and current date
    var diff = futureTime.getTime()/1000- currentTime.getTime()/1000;

    // Calculate day difference and apply class to .clock for extra digit styling.
    function dayDiff(first, second) {
        return (second-first)/(1000*60*60*24);    //判断是否大于一天
    }

    if (dayDiff(currentTime, futureTime) < 100) {
        $('.clock').addClass('twoDayDigits');
    } else {
        $('.clock').addClass('threeDayDigits');
    }

    if(diff < 0) {
        diff = 0;
        $(".clock").addClass("hidden");
        $("#startBtn").removeClass("hidden");
    }

    // Instantiate a coutdown FlipClock
    clock = $('.clock').FlipClock(diff, {
        clockFace: 'DailyCounter',
        countdown: true
    });

    var interval = setInterval(function () {
        if(clock.getTime() == 0){
            clearInterval(interval);
            $(".clock").addClass("hidden");
            $("#startBtn").removeClass("hidden");
        }
    },1000);
}

function doOffline() {
    socket.emit('studentOffline', _studentNo);
}
