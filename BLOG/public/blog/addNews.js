$(init);

function init() {
    
    $("body").on('click','#publicNews', doPublic);
    // $('.func-button').validate({
    //     wrapper:"span",
    //     onfocusout:false,
    //     submitHander:function (form) {
    //         doPublic();
    //     }
    // });
    
    $("body").on('click','#upload-pic', doUpload);    
    $("body").on('change','#choose-pic', preUpload);  //在按过选择图片后,移除对上传按钮的消隐效果
    // 'change' 在元素失去焦点的时候触发
}

function preUpload() {
    $('#upload-pic').removeClass('disabled');
}


//doUpload函数具体作用:在textarea中插入用来插图的md语句
function doUpload() {
    var file = $("#choose-pic")[0].files[0];
    var form = new FormData();    //把'form'表格元素的name与value组成一个queryString，提交到后台
    form.append("file",file);     //使用append方法添加key/value
    
    // 先转到admin.js路由文件里,保存图片文件信息
    $.ajax({
        url:"/admin/uploadImg",  //该路径由route/admin.js路由文件设置得到
        type:"post",
        data:form,
        async:true,
        processData: false,
        contentType:false,
        success:function (result) {
            startReq = false;
            if (result.code == 0){
                var picUrl = $.format("![Alt text]({0})",result.data);
                $("#news-content").insertAtCaret(picUrl);
            }
        }
        
    });
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

