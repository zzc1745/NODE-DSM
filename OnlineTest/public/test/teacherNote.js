var socket;
var _teacherNo = $.cookie('userNumber');
var _teacherName = $.cookie('userName');

$(init);

function init() {
    socket = io();
    socket.emit('login',_teacherNo);
    socket.emit('teacherLogin',_teacherNo);


    socket.on('studentGetOnline', function (_stuNo) {
        // alert("有个学生上线了");
        $('[name='+_stuNo+']').css('backgroundColor','sandybrown');
    })
    socket.on('studentFinished',function (_stuNo) {
        // alert("有一个学生完成了");
        $('[name='+_stuNo+']').css('backgroundColor','lightskyblue');
    })
    socket.on('studentGetOffline' ,function (_stuNo) {
        $('[name='+_stuNo+']').css('backgroundColor','lavenderblush');
    })
}
