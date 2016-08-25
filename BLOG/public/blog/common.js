//存放多个路由声明


//textarea 定点插入源码
//将内容插入到光标处
(function($){
    $.fn.extend({
        insertAtCaret: function(myValue){
            var $t=$(this)[0];
            if (document.selection) {
                this.focus();
                sel = document.selection.createRange();
                sel.text = myValue;
                this.focus();
            }
            else if ($t.selectionStart || $t.selectionStart == '0') {
                var startPos = $t.selectionStart;
                var endPos = $t.selectionEnd;
                var scrollTop = $t.scrollTop;
                $t.value = $t.value.substring(0, startPos) + myValue + $t.value.substring(endPos, $t.value.length);
                this.focus();
                $t.selectionStart = startPos + myValue.length;
                $t.selectionEnd = startPos + myValue.length;
                $t.scrollTop = scrollTop;
            }
            else {
                this.value += myValue;
                this.focus();
            }
        }
    })
})(jQuery);


//字符串格式化,源码
$.format = function (source, params) {
    if (arguments.length == 1)
        return function () {
            var args = $.makeArray(arguments);
            args.unshift(source);
            return $.format.apply(this, args);
        };
    if (arguments.length > 2 && params.constructor != Array) {
        params = $.makeArray(arguments).slice(1);
    }
    if (params.constructor != Array) {
        params = [params];
    }
    $.each(params, function (i, n) {
        source = source.replace(new RegExp("\\{" + i + "\\}", "g"), n);
    });
    return source;
};


//新闻管理页面,选择删除文章时弹出警示框
$('[data-toggle="confirm"]').on('click',function (e) {
    
    e.preventDefault();  //取消'事件的默认动作',将通知 Web 浏览器不要执行与事件关联的默认动作（如果存在这样的动作）。
    
    var $this = $(this);   //把this转变成jquery对象
    // $this = [a.btn.btn-danger.btn-sm, context: a.btn.btn-danger.btn-sm]
    var msg = $this.data('message');  //提取data-message属性对应的值
    
    if(confirm(msg)){   //调出confirm提示框,根据选项yes/no,如果选择yes,confirm(msg)==1,执行跳转
        location.href = $this.attr('href');  //提取href属性的值,并完成页面跳转,间接调用deleteNews函数
    }
})