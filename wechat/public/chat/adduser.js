$(init);

function init() {
    $("body").on('click', '#registerBtn', doAddUser);
}

function doAddUser(){
    $.ajax({
        type : "POST",
        url : "/register",
        contentType:"application/json",
        data:JSON.stringify({
            'usr' : $("#regUserName").val(),
            'pwd' : $("#regUserPwd").val(),
            'pwdRepeat':$("#regUserpwdCheck").val(),
            'sexual' : $("#sexualDropdown").val(),
        }),
        success: function (result) {
            if(result.code == 99){
                alert(result.msg);
            }else{
                alert("注册成功! ");
                location.href="/login";
            }
        }
    })
};
