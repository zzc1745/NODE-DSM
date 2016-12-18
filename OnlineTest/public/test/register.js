$(init)

function init() {
    $("body").on('click', '#registerBtn', doRegister);
}

function doRegister() {
    var identity = $("#register-identity input[name='identity']:checked").val();
    if(identity === "student"){
        $.ajax({
            type: "POST",
            url: "/registerStu",
            contentType: "application/json",
            dataType: "json",
            data: JSON.stringify({
                'userNo': $("#register-number").val(),
                'userName': $("#register-name").val(),
                'userPwd': $("#register-pwd").val(),
                'userIdentity': identity
            }),
            success: function (result) {
                if (result.code == 99 ) {
                    $("#register-note").text(result.msg);
                    alert(result.msg);
                }else {
                    alert("学生注册成功");
                    location.reload();
                }
            }
        })
    }else if(identity === "teacher"){
        $.ajax({
            type: "POST",
            url: "/registerTea",
            contentType: "application/json",
            dataType: "json",
            data: JSON.stringify({
                'userNo': $("#register-number").val(),
                'userName': $("#register-name").val(),
                'userPwd': $("#register-pwd").val(),
                'userIdentity': identity
            }),
            success: function (result) {
                if (result.code == 99 ) {
                    $("#register-note").text(result.msg);
                    alert(result.msg);
                }else {
                    alert("教师注册成功");
                    location.reload();
                }
            }
        })
    }

}
