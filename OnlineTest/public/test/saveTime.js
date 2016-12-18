
$(init);

function init() {
    var moment = rome.moment;
    rome(startTime);

    $("body").on('click', "#saveT", doSaveT);
}

function doSaveT() {
    $.ajax({
        type: "POST",
        url: "/modifyTime",
        contentType: "application/json",
        dataType: "json",
        data: JSON.stringify({
            'startTime': $("#startTime").val(),
            'lastTime': $("#lastTime").val(),
        }),
        success: function (result) {
            if (result.code == 99) {
                alert("修改失败");
            } else{
                alert("修改成功");
            }
        }
    })
}
