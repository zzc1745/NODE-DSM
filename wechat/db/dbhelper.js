var entries = require('./jsonRes');
var mongoose = require('./db.js');
var User = require('./schema/user');
var Message = require('./schema/message');
var Friend = require('./schema/friend');
var db = mongoose.createConnection('localhost','wechat');
var config = require('../config');

//用户登录的查找函数
exports.findUsr = function(data, cb) {
    User.findOne({username: data.usr}, function(err, doc) {
        var user = (doc !== null) ? doc.toObject() : '';
        if (err) {
            console.log(err)
        } else if (doc === null) {   //没有找到输入的用户名
            entries.code = 99;
            entries.msg = '用户名错误！';
            cb(false, entries);
        } else if (user.password !== data.pwd) { //有用户名,但密码不匹配
            entries.code = 99;
            entries.msg = '密码错误！';
            cb(false, entries);
        } else if (user.password === data.pwd) { //用户名、密码都能匹配
            entries.data = user;
            entries.code = 0;
            entries.msg = '登陆成功!';
            cb(true, entries);
        }
    })
};

exports.addUser = function(data, cb){
    User.findOne({username:data.usr},function (err, doc) {
        var user = (doc !=null)? doc.toObject():'';
        if(doc === null) {
            //如果输入的注册用户名不存在,进入密码校验
            if (data.pwd === data.pwdRepeat) {
                var newUser = new User({
                    username: data.usr,
                    password: data.pwd,
                    sexual: data.sexual,
                });
                newUser.save(function (err, doc) {
                    if (err) {
                        cb(false, err);
                    } else {
                        cb(true, entries);
                    }
                });
            } else {
                entries.code = 99;
                entries.msg = '两次输入的密码不符';
                cb(false, entries);
            }
        }
        else {
            entries.code = 99;
            entries.msg = '用户名已存在';
            cb(false, entries);
        }
    })
};

exports.addMsg = function (data, cb) {
    var msg = new Message({
        sender: data.sender,
        receiver: data.receiver,
        msgContent: data.msgContent,
        readStatus: data.readStatus
    })
    msg.save(function (err, doc) {
        if (err) {
            cb(false, err);
        } else {
            cb(true, doc);
            // alert("发送成功");
        }
    })
    //当存入未读消息时,更新friend表,未读+1
    if (data.readStatus == config.msg.UNREAD) {
        Friend.update({me: data.receiver, friend: data.sender}, {$inc: {unread: 1}}, function (err, data) {
            if (err) {
                console.log("未读消息计数加一失败");
            } else {
                console.log("加一成功");
            }
        })
    }
};

exports.searchUser = function (data, cb) {
    // var keyword = $('.search-text').val();
    var keyword = data.keyword;
    var pattern = new RegExp(keyword, "i");
    User.find({username:pattern}).exec(function (err,docs) {
        var userList = new Array();
        for(var i = 0; i < docs.length ; i++){
            userList.push(docs[i].toObject());
        }
        cb(true, userList);
    });
}

exports.addFriend = function (data,iid, cb) {
    Friend.findOne({me: data.me, friend: data.friend },function (err, doc) {
        if (err){  //查找出错
            console.log(err);
        }else if (doc === null){    //we were not friends
            if(data.friend != iid){
                //save it
                var newFriend = new Friend({
                    me: data.me,
                    friend: data.friend,
                    unread: 0,
                });
                newFriend.save(function (err, doc) {
                    if (err){
                        cb(false, err);
                    }else{
                        entries.msg = "成功添加对方为好友";
                        cb(true, entries);
                    }
                })
            }else{
                entries.code = 99;
                entries.msg = "不能添加自己为好友!";
                cb(false, entries);
            }

        }else{
            entries.code = 99;
            entries.msg = "对方已经是你的好友!";
            cb(false, entries);
        }
    })

}

exports.getFriendList = function (req, cb) {
    var _id = req.cookies.id;
    Friend.find({"me":_id}).sort({"meta.createAt" : -1}).populate('friend').exec(function (err, docs) {
        var friendList = new Array();
        for(var i=0;i < docs.length;i++){
            friendList.push(docs[i].toObject());
        }
        cb(true,friendList);
    })
}

exports.updateOffMsgs = function (data,cb) {
    var conditions_update = { "me": data.receiver, "friend":data.sender };
    var update = {$inc:{"unread":1}};
    Friend.update(conditions_update,update,function (err, docs) {
        if (err){
            console.log("更新失败");
        }else{
            console.log("成功加1");
        }
    })
}

exports.getUnreadList = function (iid, cb) {
    // ,"unread":{"$not":0}
    var condition = { me:iid, unread:{ $gt:0}};
    Friend.find(condition).exec(function (err, docs) {
        if (err){
            console.log("未读列表获取失败");
        }else {
            var unreadList = new Array();
            for (var i = 0; i < docs.length; i++) {
                unreadList.push(docs[i].toObject());
            }
            cb(true, unreadList);
        }
    })
}

exports.getUnreadMsg = function (iid, fid, cb) {
    var condition = {sender:fid,receiver:iid,readStatus:config.msg.UNREAD};
    var update = {$set:{readStatus:config.msg.READ}};
    var option = {multi: true};
    //先查找到
    Message.find(condition).exec(function (err,docs) {
        if(err){
            console.log("未读消息获取失败");
        }else{
            var unreadMsg = new Array();
            for (var i = 0; i < docs.length; i++) {
                unreadMsg.push(docs[i].toObject());
            }
            //修改消息的阅读装台
            Message.update(condition,update,option,function (err,data) {
                if (err){
                    console.log("修改未读消息状态失败");
                }else{
                    console.log("修改器成功");
                }
            });
            //清零未读消息的计数器
            Friend.update({me:iid, friend:fid},{$set:{unread:0}},function (err, data) {
                if (err){
                    console.log("未读消息计数置零失败");
                }else{
                    console.log("置零成功");
                }
            })
            cb(true, unreadMsg);
        }
    })
    //把每一条消息的readStatus改为READ
}

exports.getHistory = function (data ,cb) {
    console.dir(data);
    var con1 = data.con1;
    var con2 = data.con2;
    var condition = {$or :[
        {sender: con1, receiver:con2},
        {sender: con2, receiver:con1}
    ]};
    var con = {sender: con1, receiver:con2};
    Message.find(condition)
        .populate("sender")
        .exec(function (err, docs) {
        if (err){
            console.log("消息记录获取失败");
        }else{
            var historyList = new Array();
            for (var i =0; i< docs.length; i++){
                historyList.push(docs[i].toObject());
            }
            cb(true, historyList);
            console.log("准备输出历史记录");
            console.dir(historyList);
        }
    })
}
