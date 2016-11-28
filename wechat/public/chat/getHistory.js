$(init);

function init() {
    $("body").on('click','#getHistory' , doGetHistory);
}

function doGetHistory() {
    $.ajax({
        type: "POST",
        url: "/getHistory",
        contentType: "application/json",
        dataType: "json",
        data: JSON.stringify({
            con1: _id,
            con2: _fid
        }),
        //请求成功后调用回调函数
        success: function(result) {
            $("#allHistory").html("");
            $(".active-ch").removeClass('active-ch');
            $("#allHistory").addClass('active-ch');
            var onePieceMsg;
            for(var i =0; i< result.length; i++){
                if(result[i].sender.username == _username){
                    onePieceMsg = $.format(SEND_MSG,result[i].msgContent ,_url);
                }else  {
                    onePieceMsg = $.format(RECEIVE_MSG, result[i].msgContent, _fUrl);
                }
                $("#allHistory").append(onePieceMsg);
            }
        }
    })
}
