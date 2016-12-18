var entries = require('./jsonRes');
var mongoose = require('./db.js');
var Student = require('./schema/student');
var Teacher = require('./schema/teacher');
var Test = require('./schema/test');
var Answer = require('./schema/answer');
var db = mongoose.createConnection('localhost','onlineTest');
var config = require('../config');

exports.addStudent = function (data, cb) {
    Student.findOne({userNo: data.userNo},function (err, doc) {
        var student  = (doc != null)? doc.toObject():'';
        if(doc === null) {
            var newStudent = new Student({
                userNo: data.userNo,
                userName: data.userName,
                userPwd: data.userPwd
            });
            newStudent.save(function (err, doc) {
                if(err){
                    cb(false, err);
                } else {
                    cb(true, entries);
                }
            })
            entries.msg = "";
        }else {
            entries.code = 99;
            entries.msg = "该学生学号已经被注册!";
            cb(false, entries);
        }
    })
};

exports.addTeacher = function (data, cb) {
    Teacher.findOne({userNo: data.userNo},function (err, doc) {
        var teacher  = (doc != null)? doc.toObject():'';
        if(doc === null) {
            var newTeacher = new Teacher({
                userNo: data.userNo,
                userName: data.userName,
                userPwd: data.userPwd
            });
            newTeacher.save(function (err, doc) {
                if(err){
                    cb(false, err);
                } else {
                    cb(true, entries);
                }
            })
            entries.msg = "";
        }else {
            entries.code = 99;
            entries.msg = "该教师工号已经被注册!";
            cb(false, entries);
        }
    })
}

exports.findStudent = function (data, cb) {
    Student.findOne({userNo:data.userNo},function (err, doc) {
        var student = (doc !== null) ? doc.toObject():'';
        if (err) {
            console.log(err);
        } else if(doc === null) {
            entries.code = 99;
            entries.msg = "该学生学号尚未注册";
            cb(false, entries);
        } else if( student.userPwd !== data.userPwd){
            entries.code = 99;
            entries.msg = "输入密码错误";
            cb(false, entries);
        } else if ( student.userPwd === data.userPwd && student.status === "offline") {
            entries.data = student;
            entries.code = 0;
            entries.msg = "";
            cb(true, entries);
        } else {
            entries.code = 99;
            entries.msg = "该用户已登录/已结束答题,不可再次登录";
            cb(false, entries);
        }
    })
};

//配合登录、登出、提交 使用
exports.studentStatusChange = function (userNum, newStatus, cb) {
    Student.update({userNo:userNum},{$set : {status : newStatus}}, function (err, doc) {
        if(err){
            entries.code = 99;
            entries.msg = "修改失败";
            console.log(err);
            cb(false, entries);
        }else {
            entries.code = 0;
            entries.msg = "修改成功";
            cb(err,entries);
        }
    })
}

exports.findTeacher = function (data, cb) {
    Teacher.findOne({userNo:data.userNo},function (err, doc) {
        var teacher = (doc !== null) ? doc.toObject():'';
        if (err) {
            console.log(err);
        } else if(doc === null) {
            entries.code = 99;
            entries.msg = "该教师工号尚未注册";
            cb(false, entries);
        } else if( teacher.userPwd !== data.userPwd){
            entries.code = 99;
            entries.msg = "输入密码错误";
            cb(false, entries);
        } else if ( teacher.userPwd === data.userPwd) {
            entries.data = teacher;
            entries.code = 0;
            entries.msg = "";
            cb(true, entries);
        }
    })
};

//查找所有的题目  分页显示  一页一条
exports.findQustion = function (req, cb) {
    var page = req.query.page || 1;
    Test.find().exec(function (err, doc) {
        if(doc !== null){
            var questions = new Array();
            // console.log(doc[0].children.length);
            for(var i=0;i<doc[0].children.length; i++){
                questions.push(doc[0].children[i].toObject());
            }
            cb(true, questions[page-1]);
        }else {
            cb(false, err);
        }
    })
}

exports.saveAnswer = function (req, cb) {
    var page = req.query.page || "1";
    Answer.findOne({studentNo:req.body.studentNo, questionNo: req.body.questionNo},function (err, doc) {
        if(err){
            console.log(err);
        }
        if (doc === null){
            var newAnswer = new Answer({
                studentNo:req.body.studentNo,
                questionNo:req.body.questionNo,
                answer:req.body.answerContent,
            });
            newAnswer.save(function (err, doc) {
                if(err){
                    entries.code = 99;
                    entries.msg = "保存失败";
                    cb(false, err);
                } else {
                    entries.code = 0;
                    entries.msg = "保存成功";
                    cb(true, entries);
                }
            })
        } else {
            Answer.update({studentNo:req.body.studentNo,questionNo:req.body.questionNo}, {$set:{answer:req.body.answerContent}}, function (err, result) {
                if(err){
                    entries.code = 99;
                    entries.msg = "修改失败";
                    console.log(err);
                    cb(false, entries);
                }else {
                    entries.code = 0;
                    entries.msg = "修改成功";
                    cb(err,entries);
                }
            })
        }
    })
}

exports.findAnswer = function (req, studentNumber, cb) {
    //这边没有ajax  所以没有req.body
    var questionNumber = req.query.page || 1;
    Answer.findOne({studentNo:studentNumber, questionNo: questionNumber}, function (err ,doc) {
        var answer = (doc !== null) ? doc.toObject(): '';
        if (err){
            console.log(err);
        }
        if ( doc === null ){
            console.log("没有这条记录");
            console.log(req.body.studentNo + "," + req.body.questionNo);
        }
        cb(err, answer);
    })
}

exports.getExcelData = function (studentNum, cb) {
    Answer.find({studentNo:studentNum}).sort({questionNo:'asc'}).exec(function ( err, doc) {
        if(err){
            console.log(err);
            cb(false, err);
        } else {
            var answers = new Array();
            for(var i = 0 ; i< doc.length; i++){
                answers.push(doc[i].toObject());
            }
            cb(true, answers);
        }
    })
}

exports.changeScore = function (req, cb) {
    Answer.findOne({studentNo:req.body.studentNo, questionNo:req.body.questionNo},function (err, doc) {
        if (err) {
            console.log(err);
        } else {
            console.log("这是即将修改的数据");
            console.log(doc);
        }
    });
    Answer.update({studentNo:req.body.studentNo, questionNo:req.body.questionNo},{$set: {score: req.body.newScore}}, function (err, result) {
        if(err){
            entries.code = 99;
            entries.msg = "修改失败";
            console.log(err);
            cb(false, entries);
        }else {
            entries.code = 0;
            entries.msg = "修改成功";
            cb(err,entries);
        }
    })
}

exports.saveQuestion = function (data, page, cb) {
    Test.findOne({children:{"$elemMatch" :{ questionNo:data.QNumber}}},function (err , doc) {
        var test =  (doc !== null) ? doc.toObject(): '';
        console.dir(test.children[0].statement);
    })
    console.log("分值是");
    console.dir(data);
    Test.update({"children.questionNo":data.QNumber},{$set  :
            {'children.$.statement': data.QStatement,
            'children.$.answer' : data.QAnswer,
            'children.$.value': parseInt(data.QValue),
            }}
        ,function (err ,doc) {
        if (err){
            console.log(err);
        }else {
            console.log("update success !");
        }
    })

}

exports.findStudentsAll = function (req, cb) {
    Student.find().exec(function(err, doc){
        if(doc !== null){
            var students = new Array();
            for (var i = 0; i < doc.length; i++ ){
                students.push(doc[i].toObject());
            }
            cb(true, students);
        } else {
            cb(false, err);
        }
    })
}

exports.findTestTime = function (req, cb) {
    Test.findOne({subjectName: "science"},function (err, doc) {
        if(doc !== null){
            cb(true, doc);
        } else {
            cb(false, err);
        }
    })
}

exports.saveTestTime = function (data, cb) {
    Test.update({subjectName: "science"}, {$set: {startTime: data.startTime, lastTime:data.lastTime}}, function (err, doc) {
        if(err) {
            entries.code = 99;
            console.log(err);
            cb(false, entries);
        } else {
            entries.code = 0;
            console.log(doc);
            cb(true, entries);
        }
    })
}



//计算这个人已经做了多少题  cb
//计算这个人目前的总分     cb
exports.countInfo = function (data, cb) {
    var results = new Array();
    Student.find().exec(function (err, doc) {
        if(doc !== null) {
            var students = new Array();
            for (var i = 0; i < doc.length; i++ ){
                var oneResult = new Object();
                students.push(doc[i].toObject());
                // console.log(students[i].userNo);
                Answer.find({studentNo:students[i].userNo}).exec(function (err, docs) {
                    if (docs !== null) {
                        var studentProgress = new Array();
                        var countScore = 0;
                        for (var j = 0; j < docs.length; j++) {
                            studentProgress.push(docs[j].toObject());
                            countScore += studentProgress[j].score;
                        }
                        // console.dir(studentProgress);
                        results.push(new Object({
                            stuInfo:students[i],
                            stuAns: studentProgress,
                            totalScore : countScore,
                            countNum :studentProgress.length,
                        }));
                        console.dir(results[0].stuInfo);
                    }
                })
            }
            cb(true, results);
        } else {
            cb(false, err);
        }
    })
}
