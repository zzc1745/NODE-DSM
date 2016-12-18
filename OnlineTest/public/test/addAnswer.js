$(init);

function init() {
    $("body").on('click', "#saveAnswerBtn", saveAndQuit);    //这里应该改为先保存,并提交
    $("body").on('click', "#preQ", doSave);
    $("body").on('click', "#nextQ", doSave);
}

function doSave() {
    $.ajax({
        type: "POST",
        url: "/student",
        contentType: "application/json",
        dataType: "json",
        data: JSON.stringify({
            'studentNo': $.cookie('userNumber'),
            'questionNo': $("#question-number").html(),
            'answerContent': $("#answer-text").val(),
        }),
        success: function (result) {
            if(result.code == 99) {
                alert(result.msg);
            }
        }
    })
}

function saveAndQuit() {
    doSave();
    location.href = "/getFinishedOffline";
}
