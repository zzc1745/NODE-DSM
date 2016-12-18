$(init);

function init() {
    $("body").on('click', "#saveScoreBtn", doGrade);
    $("body").on('click', "#preQ", doGrade);
    $("body").on('click', "#nextQ", doGrade);
}

function doGrade() {
    $.ajax({
        type: "POST",
        url: "/grading",
        contentType: "application/json",
        dataType: "json",
        data: JSON.stringify({
            'questionNo': $("#question-number").html(),
            'studentNo': $("#studentNumber").html(),
            'newScore': $("#AScore").val() || 0,
        }),
        success: function (result) {
            if (result.code == 99) {
                alert(result.msg);
            }
        }
    })
}
