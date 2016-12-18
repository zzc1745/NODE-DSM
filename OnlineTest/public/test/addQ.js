$(init);

function init() {
    $("body").on('click', "#saveQ", doSave);
    $("body").on('click', "#preQ", doSave);
    $("body").on('click', "#nextQ", doSave);
}

function doSave() {
    $.ajax({
        type: "POST",
        url: "/modifyQuestion",
        contentType: "application/json",
        dataType: "json",
        data: JSON.stringify({
            'QNumber': $("#currentNo").html(),
            'QStatement': $("#Qstatement").val(),
            'QAnswer': $("#standard-answer").val(),
            'QValue': $("#Qvalue").val(),
        }),
        success: function (result) {
            if (result.code == 99) {
                alert(result.msg);
            }
        }
    })
}
