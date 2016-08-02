$(init);

function init() {
    $("body").on('click','#publicNews', doPublic);
}

function doPublic() {
    //通过ajax调用这些数据 {}中的都是调用的参数
    $.ajax({
        //将表单用post的方法发布
        type: "POST",
        url: "/admin/news",
        contentType: "application/json",
        dataType: "json",
        //data是发送到服务器的数据
        data: JSON.stringify({
            'title': $("#news-title").val(),
            'content': $("#news-content").val(),
            //id的出处和news.js中定义的不同?
            'id': $.cookie('id')   //把id存入cookie里
            // 'title' : $('#amazing1').val(),
        }),
        success: function(result) {
           if(result.code == 99){
               alert(result.msg);
           }else{
               alert("发布成功");
           }
            location.href="/blog";
        }
    })
}

