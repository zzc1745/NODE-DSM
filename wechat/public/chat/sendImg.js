$(init);

function init() {
    $("body").on('change', '#changeProfile', doUpload);  //选择文件(真)按钮
}

function doUpload() {
    alert('开始上传了');
    var file = new Array();
    var file = $("#changeProfile")[0].files[0];
    // 因为使用了选择器,返回的是一个数组,所以要用("#")[0]
    // jquery选择器返回的结果都是伪数组
    // 另外只要一个对象有length跟splice这2个属性就是伪数组
    var form = new FormData();
    form.append("file", file);
    console.dir(file);

    $.ajax({
        url: "/chat",
        type: "POST",
        data: form,
        async: true,
        processData: false, // 告诉jQuery不要去处理发送的数据
        contentType: false, // 告诉jQuery不要去设置Content-Type请求头
        success: function(result) {
            //result = Object {code: 0, data: "\upload/upload_5b6b9b42b8dad0a75f5d3ca34c8aadd1.png", msg: ""}
            //把这一段移去路由
            if (result.code == 0) {
                var picUrl = $.format("![Alt text]({0})", result.data);  //validate中间件
                $("#newsContent").insertAtCaret(picUrl);   //将内容插入到光标处
            }

            alert("上传头像成功");
        }
    });
}

function doAddNews() {

    $.ajax({
        type: "POST",
        url: "/admin/news",
        contentType: "application/json",
        dataType: "json",
        data: JSON.stringify({
            'title': $("#newsTitle").val(),
            'content': $("#newsContent").val(),
            'id': $.cookie('id')
        }),
        success: function(result) {
            if (result.code == 99) {
                notifyInfo(result.msg);
            } else {
                notifyInfo("发布成功！");
                location.href = '/pdf/blogPdf/'+ result.data._id;

                // pdf/blogPdf/57777cd9f5faaad84a10e070
            }
        }
    })
}
