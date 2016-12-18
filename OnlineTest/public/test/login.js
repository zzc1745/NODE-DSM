$(init)

function init() {
    $("body").on('click', '#loginBtn', doLogin);
}

function doLogin() {
    var identity = $("#login-identity input[name='identity']:checked").val();
    if (identity === "student"){
        $.ajax({
            type: "POST",
            url: "/loginstudent",
            contentType: "application/json",
            dataType: "json",
            data: JSON.stringify({
                'userNo': $("#login-number").val(),
                'userPwd': $("#login-pwd").val(),
                'userIdentity': identity
            }),
            success: function (result) {
                // alert(result.code);
                if (result.code == 99) {
                    alert(result.msg);
                } else {
                    $.cookie('userNumber', result.data.userNo);
                    $.cookie('userName', result.data.userName);
                    $.cookie('id', result.data._id);
                    $.cookie('identity', result.data.identity);
                    location.href = "/waiting";
                }
            }
        })
    }else {
        $.ajax({
            type: "POST",
            url: "/loginteacher",
            contentType: "application/json",
            dataType: "json",
            data: JSON.stringify({
                'userNo': $("#login-number").val(),
                'userPwd': $("#login-pwd").val(),
                'userIdentity': identity
            }),
            success: function (result) {
                // alert(result.code);
                if (result.code == 99) {
                    alert(result.msg);
                } else {
                    $.cookie('userNumber', result.data.userNo);
                    $.cookie('userName', result.data.userName);
                    $.cookie('id', result.data._id);
                    $.cookie('identity', result.data.identity);
                    location.href = "/teacher";
                }
            }
        })
    }

}
