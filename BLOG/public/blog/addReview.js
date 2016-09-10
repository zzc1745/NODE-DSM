$(init);

function init() {
    $("body").on('click', '#publicReview', doAddReview);
}

function doAddReview(){
    $.ajax({
        type : "POST",
        url : "/blogPDF/:id",
        contentType:"application/json",
        data:JSON.stringify({
            'author' : $("#reviewer").val(),
            'content' : $("#review").val(),
            // 'blogId': $.cookie('id'),
        }),
        success: function (result) {
            if(result.code == 99){
                alert(result.msg);
            }else{
                alert("留言成功! ");
            }
            // location.href="/blog/:id";
            location.reload();
        }
    })
};