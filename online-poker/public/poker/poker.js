/**
 * Created by trick on 2016/11/3.
 */


var socket;
var _username = $.cookie('username');
var cards = [];   //54张base
var myCards = [] ; //我发到的27张牌
var onlineUserCount = 0;
var leftCount;
var status = "WAITING";
var CARDTYPE = "ONE";
var STARTVALUE;
var CARDCOUNT;
var rival = {
    cardType: "NONE",
    startValue: 0,
    cardCount: 0
};
// var outObj = {};

$(init);


var outCards = [];

function init() {
    initSocket();
    // 把四个点击事件变成 状态机转换
    $("body").on('click', statusMachine);
}

function initSocket() {
    socket = io();
    //socket监听事件
    socket.on('gameInit',function (halfCard,cardsBase) {
        //把此处的init改成 传递参入到当前的socket中来 ,拷贝牌面数组与base查询对象,传入当前在线用户数量
        myCards = halfCard.slice(0);
        cards = cardsBase.slice(0);
        onlineUserCount = 2;
        doInit();
    })
    //通过function bar的显示,决定出牌权的拥有方
    socket.on('firstOut',function () {
        // alert("没错,我先出牌");
        //显示function bar
        $("#play-options").css("display","block");
    })
    //接收到对方的出牌,渲染来牌与减少对方张数,并且获得出牌权
    socket.on('checkRound', function (outCard, cardBase,obj) {
        $("#play-options").css("display","block");
        $(".out-cards").empty();
        console.log("hello 我收到牌了");
        console.dir(outCard);
        for (var i = 0; i < outCard.length; i++) {
            console.log("出牌了  yizhang");
            var outcard = $.format(OUTCARD_MODULE, cardBase[outCard[i]], outCard[i]);
            $('.rival-card')[0].remove();
            $(".out-cards").append(outcard);
        }
        // 把对方的来牌obj接受,并且复制到rival对象中去,留到后续比较时候用
        for(key in obj){
            rival[key] = obj[key];
        }
        console.dir(rival);
    })
    //显示某一个方的获胜信息,游戏结束
    socket.on('gameOver', function (winnerName) {
        $('.wait').css("display","block");
        $(".wait-info")[0].innerHTML =  "游戏结束," + winnerName + "获胜!";
        status = "GAMEOVER";
        //还要渲染一个选择框,是否重新开始,或者退出
    })
}

function statusMachine(e) {
    var tag = e.target;
    switch (status){
        case "WAITING":
            doLogin(tag);
            break;
        case "DISCARD":
            doDiscard(e);
            break;
        // case "GAMEOVER":
        //     doRestart(tag);
        //     break;
        default:
            alert("啥都没有");
    }
}


// ***************判断牌型,保存牌组信息*************************
//  CARDTYPE : ONE / PAIR / STRAIGHT / PAIRPLUS / TRIPEL  / TRIPLEPLUS  / TRIPLEDOUBEL /  FOUR /  ERR
function cardTypeMachine(card1,card2) {
    switch(CARDTYPE){
        case "ONE":
            checkPairOrStraight(card1,card2);
            break;
        case "PAIR":
            checkTripleOrPairplus(card1,card2);
            break;
        case "TRIPLE":
            checkFourOrTripleplus(card1,card2);
            break;
        case "STRAIGHT":
            checkStraight(card1,card2);
            break;
        case "PAIRPLUS":
            checkPair(card1,card2);
            break;
        case "TRIPLEPLUS":
            checkTriple(card1,card2);
            break;
        case "FOUR":
            checkFourMore(card1,card2);
            break;
        case "TRIPLEDOUBLE":
            checkTriple(card1,card2);
            break;
    }
}

//1 顺子还是对子
function checkPairOrStraight(card1, card2) {
    if(card1 == card2){
        CARDTYPE = "PAIR";
    }else if (card1 + 1 == card2){
        CARDTYPE = "STRAIGHT";
        CARDCOUNT++;
    }else {
        CARDTYPE = "ERR";
    }
}
//2 三张还是对子加一
function checkTripleOrPairplus(card1, card2) {
    if(card1 == card2){
        CARDTYPE = "TRIPLE";
    }else if (card1 + 1 == card2){
        CARDTYPE = "PAIRPLUS";
    }else {
        CARDTYPE = "ERR";
    }
}
//3 四张还是三带一(此处是三张连队的中间态)
function checkFourOrTripleplus(card1, card2) {
    if(card1 == card2){
        CARDTYPE = "FOUR";
    }else if (card1 +1 == card2){
        CARDTYPE = "TRIPLEPLUS";
    }else {
        CARDTYPE = "ERR";
    }
}
//4 是否是顺子加一
function checkStraight(card1, card2) {
    if(card1 +1 == card2){
        CARDTYPE = "STRAIGHT";
    }else {
        CARDTYPE = "ERR";
    }
}
//5 是否是连对
function checkPair(card1, card2) {
    if(card1 == card2){
        CARDTYPE = "PAIR"
        CARDCOUNT++;
    }else {
        CARDTYPE = "ERR";
    }
}
//6 是否是三带二(此处是三张连队的中间态)
function checkTripledouble(card1, card2) {
    if(card1 == card2){
        CARDTYPE = "TRIPLEDOUBLE";
    }else {
        CARDTYPE = "ERR";
    }
}
//7 判断四张加一
function checkFourMore(card1, card2) {
    CARDTYPE = "ERR";
}
//8 判断判断三张连对
function checkTriple(card1, card2) {
    if(card1 == card2){
        CARDTYPE = "TRIPLE";
        CARDCOUNT++;
    }else if (card1 +1 == card2){
        CARDTYPE = "ERR";
    }
}

// ***************判断牌型,保存牌组信息*************************

function doLogin(tag) {
    //获取当前用户名
    if(tag.id == "loginWithName") {
        var uname = $("#username-input").val();
        if (uname) {
            $.cookie('username', uname);
            socket.emit('login', uname);
            _username = uname;
            $(".playerName")[0].innerHTML = _username;
            //隐去登录层,进入等待界面
            $(".login").css("display", "none");
            $(".wait").css("display", "block");
        }
    }
}

function doInit() {
    if(onlineUserCount == 2){
        $(".wait").css("display", "none");
        deal(myCards, cards);
        doCreateRivalCards(myCards, cards);
        status = "DISCARD";
    }
}

function doDiscard(e) {
    var tag = e.target;
    // tag的返回值是点击对象
    if(tag.id == "out-btn"){           //出牌
        doOutCards();
    } else if(tag.id == "pass-btn"){   //过一轮
      doPass();
    } else if(tag.className.indexOf("me-card") != -1){                            //选牌
        doShowOrHidden(tag);
    }
    //如果加了放弃按钮,还可以在添加一个直接从DISCAR转为GAMEOVER状态
}

//渲染对方牌面
function doCreateRivalCards(halfCard,cardBase) {
    for (var i = 0; i < halfCard.length; i++) {
        var rivalCard = $.format(RIVALCARD_MODULE, cardBase[0], 0);
        $('.rival-cards').append(rivalCard);
    }
}

//渲染我的牌面
function deal(halfCard, cardBase) {
    halfCard.sort(compare);
    for (var i = 0; i < halfCard.length; i++) {
        var myCard = $.format(MYCARD_MODULE, cardBase[halfCard[i]], halfCard[i]);
        $('.me-cards').append(myCard);
    }
    leftCount = halfCard.length;
}

//选牌
function doShowOrHidden(tag) {
    //如果曾经被选中,现在退选,并从选中牌面数组中删去
    var cname = tag.className;
    if (cname.indexOf("chosen")!= -1) {
        cname = "me-card";
        tag.className = cname;
        var faceValue = tag.name;
        //找出该张牌曾经在outCards数组中的位置,并删除
        var index = outCards.indexOf(faceValue);
        if (index !== -1) {
            outCards.splice(outCards.indexOf(faceValue), 1);
        }
    } else if(cname.indexOf("chosen") == -1) {
        cname += " chosen";
        tag.className = cname;
        var thisname = tag.name;
        outCards.push(thisname);
    }
    console.dir(outCards);
}

//出牌
function doOutCards() {
    if(outCards.length != 0) {
        outCards.sort(compare);
        //复制outCards数组,避免污染outCards原数组
        var copy = [];
        for(var i = 0;i<outCards.length;i++){
            copy[i] = outCards[i];
        }
        //对每一张牌遍历,进入cardType安检  实质上是默认获取第一张牌,然后从第二张牌开始逐张检验
        copy[0] = valuePre(copy[0]);
        CARDTYPE = "ONE";
        STARTVALUE = copy[0];
        CARDCOUNT = 1;
        for (var i = 0; i < copy.length - 1; i++) {
            copy[i + 1] = valuePre(copy[i + 1]);
            // alert("又读到一张" + copy[i+1]);
            cardTypeMachine(copy[i],copy[i+1]);
        }
        //对最后的牌组判定进行筛选,把未完态也转化为ERR状态
        //  CARDTYPE :  PAIRPLUS / TRIPLEPLUS  / TRIPLEDOUBEL   半完成态
        if(CARDTYPE == "PAIRPLUS" || CARDTYPE == "TRIPLEPLUS" || CARDTYPE == "TRIPLEDOUBEL"){
            CARDTYPE = "ERR";
        }
        if(CARDTYPE == "STRAIGHT" && CARDCOUNT < 5){
            CARDTYPE = "ERR";
        }
        var outObj = {
            "cardType":CARDTYPE,
            "startValue":STARTVALUE,
            "cardCount": CARDCOUNT
        };
        console.dir(outObj);
        console.dir(rival);
        //当出牌符合规则,并且牌面比对方大,就可以压牌
        // 判断我方出牌是否能够压住对方来牌
        var comp = cardCompare(outObj,rival);   //outObj >> rival
        // 判断函数结束
        if(outObj.cardType != "ERR" && comp == true) {
            // 清空前一轮的出牌,渲染新的出牌
            $(".out-cards").empty();
            for (var i = 0; i < outCards.length; i++) {
                $("img[name=" + outCards[i] + "]").remove();
                var outcard = $.format(OUTCARD_MODULE, cards[outCards[i]], outCards[i]);
                $(".out-cards").append(outcard);
            }
            //更新我方计数器,查看余牌是否为0,能否获胜
            leftCount -= outCards.length;
            //把我方此轮的出牌,发送给服务器
            socket.emit('nextTurn', _username, outCards, outObj);
            console.log(leftCount);
            outCards.splice(0, outCards.length);
            $("#play-options").css("display", "none");
            //判定余牌数之后的操作之后,还要修改status
            if (leftCount == 0) {
                //给服务器发送我方获胜信息,由服务器完成二次分发
                socket.emit("win", _username);
                status = "GAMEOVER";
            }
        }
    }
}

//过牌
function doPass() {
    $(".chosen").removeClass('chosen');
    outCards.splice(0, outCards.length);
    $("#play-options").css("display","none");
    var noCard = {
        cardType: "NONE",
        startValue: 0,
        cardCount: 0
    };
    socket.emit('nextTurn', _username,outCards,noCard);
}

//手牌排序
function compare(value1, value2) {
    var v1 = valuePre(value1);
    var v2 = valuePre(value2);
    if(v1 < v2){
        return -1;
    }else if(v1 > v2){
        return 1;
    }else{
        return 0;
    }
}

function valuePre(value) {
    var v1;
    if(value ==53 ||value ==54){
        v1 = value;
    }else {
        v1 = value % 13;
        if (v1 == 0) {
            v1 = 13;
        } else if (v1 == 1) {
            v1 = 14;
        } else if (v1 == 2) {
            v1 = 15;
        }
    }
    return v1;
}

function cardCompare(myObj,rivalObj) {
    if (rivalObj.cardType == "FOUR") {
        if (myObj.cardType == "FOUR") {     //我方是炸弹,对方也是炸弹
            return valueCompare(myObj.startValue, rivalObj.startValue);
        } else {                           //我方不是炸弹,对方是炸弹
            return false;
        }
    }else if(rivalObj.cardType == "NONE"){
        return true;
    }else {
        if(myObj.cardType == "FOUR"){    //我方是炸弹,对方不是炸弹
            return valueCompare(myObj.startValue,rivalObj.startValue);
        }else {                      //我方不是炸弹,对方也不是炸弹
            //牌型相同,张数相同才能比较大小
            if(myObj.cardType == rivalObj.cardType && myObj.cardCount == rivalObj.cardCount){
                return valueCompare(myObj.startValue,rivalObj.startValue);
            }else{
                return false;
            }
        }
    }
}

function valueCompare(value1,value2) {
    if (value1 > value2){
        return true;
    }else{
        return false;
    }
}
