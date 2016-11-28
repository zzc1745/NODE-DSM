$(init);

function init() {
    $('.search-text').keypress(function (e) {   //编辑框回车发送消息
        if (e.which == 13) {
            doSearch();
        }
    })
}



function doSearch() {
    $.ajax({
        type: "POST",
        url: "/search",
        contentType: "application/json",
        dataType: "json",
        data: JSON.stringify({
            'keyword': $(".search-text").val(),
        }),
        success: function(result) {
            // result = userList[]
            var username;
            var userid;
            var child;
            $('.search-result').text("");
            for (var i = 0; i < result.length;i++ ){
                username = result[i].username;
                userid = result[i]._id;
                // child = "<div class='result-item' ><span>"+ username + "</span> <a href='/addToFriend/"+ userid + "' name='" + userid + "' class='addBtn'></a></div>";
                child = "<div class='result-item' ><span>"+ username + "</span> <a href='javascritp:void(0);'  name='" + userid + "' class='addBtn'></a></div>";
                $('.search-result').append(child);
            }
        }
    })
}

