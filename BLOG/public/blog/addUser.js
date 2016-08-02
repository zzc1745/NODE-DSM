$(init);

function init() {
    $("body").on('click', '#regBtn', doAddUser);
}

function doAddUser(){
    $.ajax({
        type : "POST",
        url : "/admin/reg",
        contentType:"application/json",
        data:JSON.stringify({
            'usr' : $("#reg-username").val(),
            'pwd' : $("#reg-password").val(),
            'pwdRepeat':$("#reg-password-repeat").val(),
            'email':$("#reg-email").val(),
            'address':$("#reg-address").val()
        }),
        success: function (result) {
            if(result.code == 99){
                alert(result.msg);
            }else{
                alert("注册成功! ");
            }
            location.href="/login";
        }
    })
};