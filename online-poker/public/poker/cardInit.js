$(initCards);

cards = {};
card_width = 90;
card_height = 120;
var socket;

function initCards() {
    var socket = io();
    var img = "public/images/poker.png";
    var image = new Image();
    var topOffset = 0;
    var leftOffset = 0;
    image.src = img;
    image.onload = function(){
        //逐个取出纸牌牌面
        for(var i = 0; i < 4; i++){
            // 红桃、方片、黑桃、草花
            topOffset = i*card_height;
            for(var j = 0; j<= 12; j++){
                leftOffset = j * card_width;
                var base64 = getBase64Image(image, leftOffset, topOffset);
                // console.log(topOffset,leftOffset);
                // console.log(base64);
                cards[13*i+j+1] = base64;
            }
        }
        // 最后加上大小王
        for(var i = 4,j = 0; j< 2;j++){
            topOffset = i*card_height;
            leftOffset = j*card_width;
            var base64 = getBase64Image(image, leftOffset, topOffset);
            // var base64 = getBase64Image(image,0 ,0 , 90,90);
            // console.log(base64);
            cards[13*i+j+1] = base64;
        }
        //取一个牌的反面
        cards[0] = getBase64Image(image, 2*card_width, 4*card_height);
        //初始化完成之后,将牌发送给服务器
        socket.emit('cardDone', cards);
    }
    console.dir(cards);
}

function getBase64Image(img,leftOffset,topOffset) {
    var canvas = document.createElement("canvas");
    canvas.width = 90;
    canvas.height = 120;
    var ctx = canvas.getContext("2d");
    // drawImage(image,sourceX,sourceY,sourceWidth,sourceHeight,destX,destY,destWidth, destHeight)
    ctx.drawImage(img,leftOffset,topOffset, card_width, card_height,0,0,card_width,card_height);
    // ext 表示图片类型
    var ext = img.src.substring(img.src.lastIndexOf(".")+1).toLowerCase();
    var dataURL = canvas.toDataURL("image/"+ext);
    return dataURL;
}
