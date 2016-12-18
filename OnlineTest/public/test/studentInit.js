var socket;
var _studentNo = $.cookie('userNumber');
var _studentName = $.cookie('userName');

$(init);

function init() {
    initSocket();
    $("body").on('click',"#saveAnswerBtn", doSubmitAndQuit);
    $("body").on('click', "#quitUndo", doOffline);
    setTimeClock();
}

function initSocket() {
    socket = io();
}

function doSubmitAndQuit() {
    socket.emit('studentSubmit', _studentNo);
}
function doOffline() {
    socket.emit('studentOffline', _studentNo);
}

function setTimeClock() {
    var time = $("#periodT").html();
    var startTime = new Date(time);
    var period = $("#last").html();
    var seconds = parseInt(period) * 60;
    setInterval(function () {
        var currentTime = new Date();
        console.log(startTime);
        console.log(currentTime);
        var diff = currentTime.getTime() - startTime.getTime();
        console.log(diff.toString());
        if(diff >= seconds ){
            $("#saveAnswerBtn").click();
        }
    },1000);
}
