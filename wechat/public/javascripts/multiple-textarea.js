/***
 * author:YuHongDa
 * date:2015-08-19
 * div contenteditable+input.file 实现拖拽传送文件(暂时支持单个文件拖拽，多个待实现)
 * 此demo未考虑浏览器兼容性，测试过Chrome和FF
 * @defaults
 *  fileContainer:存放文件容器Id
 *  height:缩略图高度
 *  width:缩略图宽度
 *  inputfile:上传文件组件的ID,
 *  filesize:上传文件大小
 *  fileType：上传文件分类 1：图片  2：其他文件（暂未实现） （其他待实现）
 *  photofiles:上传图片后缀名，此属性与fileType共同使用，fileType为1时生效，其他时可忽略
 *  otherfiles:其他文件后缀名，此属性与fileType共同使用，fileType为2时生效，其他时可忽略
 *
 *
 */
(function ($, doc, undefined) {
    $.fn.createMultiple = function (params) {
        var defaults = {
            fileContainer: '',
            height: 20,
            width: 20,
            inputfile: '',
            filesize: 2000,
            filetype: 1,
            photofiles: ['png','jpg','jpeg','gif'],
            otherfiles: []

        };
        var options = $.extend(defaults, params);
        if (options.fileContainer == "") {
            throw  new Error("The style is Empty!");
        }
        if (options.inputfile == "") {
            throw new Error("The inputFile Id is Empty!");
        }
        if (typeof options.filetype != "number") {
            throw new Error("The file type must be Number And can't be empty!");
        }
        var fileContainer = $('#' + options.fileContainer), inputFile = doc.getElementById(options.inputfile), fileTempLate = "<img src={0} height={1} width={2}>",
            emum = {
                photo: 1,
                other: 2
            };
        __regexoperators___/***type file is Photos***/
        var showPhoto = function () {
                if (inputFile.files) {
                    appendImage(inputFile.files);
                }
            },
            __regexoperators___/***types file is others***/
            showOther = function () {
                alert("to be continued!")
            }, 
                //把图片的html代码添加进输入框的div
            appendImage = function (files) {
                var sizeStr="",typeStr="";
                //用来生成错误提示信息
                for (var i = 0, len = files.length; i < len; i++) {
                    //大小不对
                    if (files[i].size / 1000 > options.filesize) {
                        sizeStr+=files[i].name;
                        sizeStr+="、";
                        continue;
                    }
                    //类型不对
                    if (options.photofiles.indexOf(files[i].name.substring(files[i].name.lastIndexOf('.') + 1, files[i].name.length)) == -1) {
                        typeStr+=files[i].name;
                        typeStr+="、";
                        continue;
                    }
                    //符合标准的图片，生成对象并显示
                    var reader = new FileReader();
                    reader.readAsDataURL(files[i]);
                    reader.onload = function (e) {
                        var img = this.result;
                        fileContainer.html(fileContainer.html() + String.imgFormat(fileTempLate, img, options.height, options.width));
                    }
                }
                //如果存在错误信息，则弹出
                if(sizeStr){
                    alert(sizeStr+" are too large,Must be smaller than ‘" + options.filesize + "KB’");
                }
                if(typeStr){
                    alert('Does is not support this kind of type:'+typeStr);
                }
                
            }

        $('#' + options.inputfile).bind('change', function () {
            switch (options.filetype) {
                case emum.photo:
                    showPhoto();
                    break;
                case emum.other:
                    break;
                    showOther();
                default:
                    alert("The fileType is undefined!");
            }
        });
        $(document).on({
            dragleave: function (e) {
                e.preventDefault();
                fileContainer.removeClass('over');
            },
            drop: function (e) {
                e.preventDefault();
                fileContainer.removeClass('over');
            },
            dragenter: function (e) {
                e.preventDefault();
                fileContainer.addClass('over');
            },
            dragover: function (e) {
                e.preventDefault();
                fileContainer.addClass('over');
            }
        });
        doc.getElementById(options.fileContainer).addEventListener('drop', function (e) {
            e.preventDefault();
            if (e.dataTransfer.files) {
                appendImage(e.dataTransfer.files);
            }

        }, false);
    }
})(window.jQuery, window.document);
String.imgFormat = function (str) {
    for (var i = 1; i < arguments.length; i++) {
        str = str.replace(new RegExp("\\{" + (i - 1) + "\\}", "g"), arguments[i] != undefined ? arguments[i] : "");
    }
    return str;
};