$(init);

function init() {
    $("body").on('click','#publicNews', doPublic);
}

function doPublic() {
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
            'id': $.cookie('id')
            // 'title' : $('#amazing1').val(),
        }),
        success: function(result) {
           if(result.code == 99){
               alert(result.msg);
           }else{
               alert("发布成功");
           }
        }
    })
}

