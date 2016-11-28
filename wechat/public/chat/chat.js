var socket;
var _username = $.cookie('username');
var _id = $.cookie('id');
var _url = $.cookie('imgUrl');
var _fid ;
var _fUrl;
$(init);



function init() {
    initSocket();
    //按钮绑定事件初始化
    $('.enter-box').keypress(function (e) {if (e.which == 13) {doSendMessage();}});
    $('#send-message-btn').click(function () {doSendMessage();})
    $("body").on('click', '.addBtn' , doAddFriend);
    $("body").on('dblclick', '.friend-item' , doCreateSession);
    $("body").on('click', '.chat-item', showChattingWindow);
    $('.emotion').qqFace({
        id : 'facebox',
        assign:'saytext',   //给输入框赋值
        path:'../public/arclist/'	    //表情图片存放的路径,来源
    });
    $("body").on('change','#sendImage', function () {
        if (this.files.length != 0) {
            var file = this.files[0],
                reader = new FileReader();
            reader.onload = function(e) {
                //能不能在这里加一个ajax保存???
                // $.ajax({});
                console.log("准备发出一张图片");
                socket.emit('img', _id,_fid, e.target.result, _fUrl);
                this.value = '';
            };
            reader.readAsDataURL(file);
        };
    });
}


//初始化当前用户的socket
function initSocket() {
    socket = io();
    socket.emit('login',_id);
    $(".user-name")[0].innerHTML = _username;
    // $(".user-info img")[0].attr("src",_url);
    $(".user-info img")[0].src = _url;
    $("#chatting-title span")[0].innerHTML = "";
    socket.emit("getUnreadList", _id);

    //客户端监听消息,处理前端的消息显示,如果收到消息就在消息盒中append一个子节点
    socket.on('msg', function (sender, receiver, msg, senderUrl) {
        //动态创建代码块
        console.log("传递消息ing");
        if (sender == _id) {     //是我方发出的消息
            var newSendMsg = $.format(SEND_MSG,msg, _url);
            $("#ch"+ receiver).append(newSendMsg);   //$("#ch"+ receiver)指的是我与receiver的对话框
            $("#ch"+ receiver).scrollTop($("#ch"+ receiver)[0].scrollHeight);
        }else {      //我方收到他方消息
            var fname = $(".group-list").find("div[name="+sender+"]").find(".chat-item-username").html();
            socket.emit('startSession', receiver, sender, fname, senderUrl);
            //设置延时,给声称会话窗口留出充足时间
            setTimeout(function () {
                var newRecieveMsg = $.format(RECEIVE_MSG, msg , senderUrl);
                $("#ch" + sender).append(newRecieveMsg);
                $("#ch" + sender).scrollTop($("#ch" + sender)[0].scrollHeight);
            }, 100);
        }
    })
    //收到图片消息
    socket.on('newImg', function (sender, receiver, img, senderUrl) {
        if (sender == _id) {     //是我方发出的消息
            var newSendImg = $.format(SEND_IMG,img, _url);
            $("#ch"+ receiver).append(newSendImg);   //$("#ch"+ receiver)指的是我与receiver的对话框
            $("#ch"+ receiver).scrollTop($("#ch"+ receiver)[0].scrollHeight);
        }else {      //我方收到他方消息
            var fname = $(".group-list").find("div[name="+sender+"]").find(".chat-item-username").html();
            socket.emit('startSession', receiver, sender, fname ,senderUrl);
            //设置延时,给声称会话窗口留出充足时间
            setTimeout(function () {
                var newRecieveImg = $.format(RECEIVE_IMG, img ,senderUrl);
                $("#ch" + sender).append(newRecieveImg);
                $("#ch" + sender).scrollTop($("#ch" + sender)[0].scrollHeight);
            }, 100);
        }
    })
    //显示添加好友状态
    socket.on('addConfirm',function (data) {
        alert(data.msg);
    })
    //创建新的会话窗口
    socket.on('newWindow',function (fid, fname, fUrl) {
        console.log("我来创建新window了");
        _fid = fid;
        $("#chatting-title span")[0].innerHTML = fname;
        $(".active-ch").removeClass('active-ch');
        var newChattingWindow = $.format(CHATTINGWINDOW_MODULE,fid);
        $("#chatting-history").append(newChattingWindow);
        var newSession = $.format(SESSION_MODULE,fid,fname,fUrl);
        $(".chat-list").prepend(newSession);
    })
    //创建被动触发的会话窗口
    socket.on('newHiddenWindow',function (fid, fname) {
        console.log("我来创建新window了");
        _fid = fid;
        $("#chatting-title span")[0].innerHTML = fname;
        $(".active-ch").removeClass('active-ch');
        var newChattingWindow = $.format(CHATTINGWINDOW_MODULE,fid);
        $("#chatting-history").append(newChattingWindow);
        var newSession = $.format(SESSION_MODULE,fid,fname);
        $(".chat-list").prepend(newSession);
        var newRecieveMsg = $.format(RECEIVE_MSG, msg);
        $("#ch" + fid).append(newRecieveMsg);
        $("#ch" + fid).scrollTop($("#ch" + fid)[0].scrollHeight);
    })
    //显示当前指定的会话框(已生成)
    socket.on('showWindow',function (fid, fname) {
        _fid = fid;
        $("#chatting-title span")[0].innerHTML = fname;
        $(".active-ch").removeClass('active-ch');
        $("#ch"+fid).addClass('active-ch');
    })
    //在初始化未读列表时,在会话列表添加新的会话入口
    socket.on('createUnreadSession',function (fid, unread) {
        var fname = $(".group-list").find("div[name="+fid+"]").find(".chat-item-username").html();
        var fUrl = $(".group-list").find("div[name="+fid+"]").find("img")[0].src;
        var newUnreadSession = $.format(OFFLINESESSION_MODULE,fid,fname,unread,fUrl);
        $(".chat-list").prepend(newUnreadSession);
    })
    //在初始化未读列表时,隐式在chatting-history添加新的会话窗口
    socket.on('createUnreadWindow',function (iid,fid) {
        var fname = $(".group-list").find("div[name="+fid+"]").find(".chat-item-username").html();
        $("#chatting-title span")[0].innerHTML = fname;
        $(".active-ch").removeClass('active-ch');
        var newChattingWindow = $.format(UNREADCHATTINGWINDOW_MODULE,fid);
        $("#chatting-history").append(newChattingWindow);
    })
    //接收离线消息的逐条渲染
}

// //搜索好友
// function doSearchFriend() {
//     var keyword = $('.search-text').val();
//     var pattern = new RegExp(keyword, "i");
//     sendAjax(pattern);
//     var queryParams = {username: pattern};
//     // socket.emit('searchUser', res, req, queryParams);
// }

//回车事件与SendBtn点击,发送消息给服务器
function doSendMessage() {
    var msg = $(".enter-box").val();
    $('.enter-box').val('');
    // $('.enter-box').html('');   //如果是div
    socket.send(_id, _fid, replace_em(msg), _fUrl, _url);
}

function replace_em(str){
    str = str.replace(/\</g,'&lt;');
    str = str.replace(/\>/g,'&gt;');
    str = str.replace(/\n/g,'<br/>');
    str = str.replace(/\[em_([0-9]*)\]/g,'<img src="/public/arclist/$1.gif" border="0" />');
    return str;
}

//添加对方为好友
function  doAddFriend(e) {
    //在好友列表中显示新增好友
    var newFriendId = $(e.target).attr('name');
    var newFriendName = $(e.target).parent().find("span").html();
    var newChatItem = $.format(FRIEND_MODULE,newFriendId,newFriendName);
    $(".group-list").append(newChatItem);
    console.log(newFriendId);
    //在数据库中增加好友
    socket.emit('addNewFriend', _id , newFriendId);
}

//初始化会话窗口   //我方主动发起
function doCreateSession() {
    var fid = $(this).attr('name');
    var fname = $(this).find(".chat-item-username").html();
    var fUrl = $(this).find("img")[0].src;
    _fUrl = fUrl;
    socket.emit('startSession', _id , fid , fname, fUrl);
}

//打开与该好友的会话窗口(非新建)
function showChattingWindow(){
    var fid = $(this).attr('id');
    var fname = $(this).find(".chat-item-username").html();
    var fUrl = $(this).find("img")[0].src;
    _fUrl = fUrl;
    socket.emit('startSession', _id, fid, fname ,fUrl);
    //显示未读消息内容,还要把未读消息数置0
    console.log("准备了准备了,要渲染未读消息了");
    socket.emit('showAndClearUnread', _id , fid);
    $(this).find(".unreadDiv").removeClass('unreadNote');
    $(this).find(".unreadDiv")[0].innerHTML = "0";
}


