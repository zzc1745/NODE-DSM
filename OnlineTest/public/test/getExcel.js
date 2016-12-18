
$(init);

function init() {
    $("body").on('click', ".toExcel", doExport(e));
}

function doExport(e) {
    e.preventDefault();
    var $this = $(this);
    
    $.ajax({
        type: "POST",
        url: "/excel/:id",
        contentType: "application/json",
        dataType: "json",
        data: JSON.stringify({})
    })
}
