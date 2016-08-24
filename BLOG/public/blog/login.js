$(init);
//login界面的ajax调用表单数据,传入routes/index.js文件中的函数调用
function init() {
    $("body").on('click', '#loginBtn', doLogin);
    //          对象ID,需要自己在div中设   调用的函数
    //可以实时创建对象 #loginBtn
}
function doLogin() {
    $.ajax({
        //将表单用post的方法发布
        type: "POST",
        url: "/login",
        // url: "/",
        contentType: "application/json",
        dataType: "json",
        data: JSON.stringify({
            'usr': $("#usr").val(),
            'pwd': $("#pwd").val()
        }),
        //请求成功后调用回调函数
        success: function(result) {
            if (result.code == 99) {
                //如果是99 说明错误 返回错误原因
                $(".login-box-msg").text(result.msg);
            } else {
                //把数据存进cookie,目的是用于之后的用户进入界面调用该登录用户数据
                $.cookie('username', result.data.username, {expires:30});
                $.cookie('password', result.data.password, {expires:30});
                $.cookie('id', result.data._id, {expires:30});
                location.href = "/blog";
                // location.href = "/yes/blog";
            }
        }
    })
}