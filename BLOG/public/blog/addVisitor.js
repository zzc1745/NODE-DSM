$(init);

function init() {
    $("body").on('click',"#loginBtn", addVisitor);   //点击登录,就添加一条访客记录
};

function addVisitor() {
    $.ajax({
        type: "POST",
        url: "/login",
        contentType: "application/json",
        dataType: "json",
        data: JSON.stringify({
            // 'visitorName': $.cookie('username'),
            'visitorName': $("#usr").val(),
            'visitorID': $.cookie('id'),

        }),
        success: function(result) {
            if (result.code == 99) {
            //如果是99 说明错误 返回错误原因
            $(".login-box-msg").text(result.msg);
        } else {
            // dbHelper.countVisitor
            //把数据存进cookie,目的是用于之后的用户进入界面调用该登录用户数据
            $.cookie('VisId', result.data._id, {expires:30});
            location.href = "/blog";
            // location.href = "/yes/blog";
        }
            // 调用count函数,并且保存结果到cookie里面
            // 然后在页面上把cookie调出来
        }

    })
}