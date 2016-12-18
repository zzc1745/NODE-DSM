var express = require('express');
var router = express.Router();
var dbHelper = require('../db/dbHelper');
var Test = require('../db/schema/test');
var config = require('../config');
var excelPort = require('excel-export');
var fs = require('fs');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('login',{ layout: 'layout'});
});

router.post('/', function (req, res, next) {
})

router.post('/loginstudent',function (req, res, next) {
    dbHelper.findStudent(req.body, function (success, docs) {
            req.session.user = docs.data;
            res.send(docs);
    })
})

router.post('/loginteacher',function (req, res, next) {
    dbHelper.findTeacher(req.body, function (success, doc) {
        req.session.user = doc.data;
        res.send(doc);
    })
})

router.post('/registerStu',function (req, res, next) {
    dbHelper.addStudent(req.body, function (success, doc) {
        console.dir(req.body);
      res.send(doc);
    })
})

router.post('/registerTea',function (req, res, next) {
    dbHelper.addTeacher(req.body, function (success, doc) {
      res.send(doc);
    })
})

router.get('/teacher', function (req, res, next) {
    dbHelper.findStudentsAll(req, function (success, docs) {
        dbHelper.findTestTime(req, function (success, doc) {
            subjectName = doc.subjectName;
            startTime = doc.startTime;
            lastTime = doc.lastTime;
            res.render('teacher',{
                    layout: 'exam',
                    student: docs,
                    exmeName: subjectName,
                    startTime: startTime,
                    lastTime: lastTime,
             });
        });
    })
})

router.get('/paper/:id', function (req, res, next) {
    var page = req.query.page || 1;
    var number = req.params.id;
    dbHelper.findQustion(req, function (success, doc) {
        dbHelper.findAnswer(req, number, function (success, answer) {
            res.render('paper', {
                layout: 'exam',
                question: doc,
                pageNumber: page,
                oldAnswer: answer.answer,
                oldScore: answer.score,
                studentNo: number,
            });
        });
    })
})

router.post('/grading', function (req, res, next) {
    dbHelper.changeScore(req ,function (success, doc) {
        res.send(doc);
    })
})

router.get('/student', function (req, res, next) {
    var page = req.query.page || 1;
    var subjectName, startTime,lastTime;
    dbHelper.findTestTime(req, function (success, doc) {
        subjectName = doc.subjectName;
        startTime = doc.startTime;
        lastTime = doc.lastTime;
        dbHelper.findQustion(req, function (success, docs ){
            var number = req.cookies.userNumber;
            dbHelper.findAnswer(req, number, function (success, answer) {
                res.render('student', {
                    layout: 'exam',
                    question: docs,
                    pageNumber: page,
                    oldAnswer: answer.answer,
                    studentName: req.cookies.userName,
                    studentNo: number,
                    examName: subjectName,
                    startTime: startTime,
                    lastTime: lastTime,
                });
            });
        })
    })
})

router.post('/student',function (req, res, next) {
    //当前路由中,req.query.page不存在
    dbHelper.saveAnswer(req, function (success, doc) {
        res.send(doc);
    })
})

router.get('/waiting',function (req, res, next) {
    dbHelper.findTestTime(req, function (success, doc) {
        res.render('waiting', {
            layout: 'exam',
            startTime: doc.startTime,
            lastTime: doc.lastTime,
        });
    })

})

router.get('/modifyTime', function (req, res, next) {
    dbHelper.findTestTime(req, function (success, doc) {
        res.render('modifyTime', {
            layout:'admin',
            start: doc.startTime,
            last: doc.lastTime,
        });
    })
})

router.post('/modifyTime', function (req, res, next) {
    dbHelper.saveTestTime(req.body, function (success, doc) {
        res.send(doc);
    })
})

router.get('/modifyQuestion', function (req, res, next) {
    var page = parseInt(req.query.page || 1);
    dbHelper.findQustion(req, function (success, doc ){
        res.render('modifyQuestion', {
            layout:'admin',
            pageNumber:page,
            oldQuestion: doc,
        });
    });
})

router.post('/modifyQuestion', function (req, res, next) {
    var page = parseInt(req.query.page || 1);
    dbHelper.saveQuestion(req.body, page, function (success, doc) {
        res.send(doc);
    })
})

router.get('/admin', function (req, res, next) {
    dbHelper.findStudentsAll(req, function (success, doc) {
        res.render('admin', {
            layout:'admin',
            student: doc,
        })
    })
})

router.get('/excel/:id', function (req, res, next) {
    //查找单人答案
    var userNo = req.params.id;
    dbHelper.getExcelData(userNo, function (success, doc) {
        var datas = doc;
        var conf = {};
        var filename = userNo;
        var total = 0;
        for(var i = 0; i < doc.length; i++){
            total += parseInt(doc[i].score);
        }
        conf.cols = [
            {caption:'学号', type:'String', width:40},
            {caption:'第一题回答', type:'String', width:40},
            {caption:'第一题得分', type:'String', width:40},
            {caption:'第二题回答', type:'String', width:40},
            {caption:'第二题得分', type:'String', width:40},
            {caption:'第三题回答', type:'String', width:40},
            {caption:'第三题得分', type:'String', width:40},
            {caption:'第四题回答', type:'String', width:40},
            {caption:'第四题得分', type:'String', width:40},
            {caption:'第五题回答', type:'String', width:40},
            {caption:'第五题得分', type:'String', width:40},
            {caption:'总得分', type:'Number', width:40},
        ];

        var array = [];
        // array[0]= [userNo,
        //     doc[0].answer,doc[0].score,
        //     doc[1].answer,doc[1].score,
        //     doc[2].answer,doc[3].score,
        //     doc[3].answer,doc[3].score,
        //     doc[4].answer,doc[4].score,
        //     total];

        array[0] = [
            userNo,
            (doc[0].answer).toString(), (doc[0].score).toString(),
            (doc[1].answer).toString(), (doc[1].score).toString(),
            (doc[2].answer).toString(), (doc[2].score).toString(),
            (doc[3].answer).toString(), (doc[3].score).toString(),
            (doc[4].answer).toString(), (doc[4].score).toString(),
            total
        ]

        conf.rows = array;
        var result = excelPort.execute(conf);
        var random = Math.floor(Math.random()*10000 + 0);
        var uploadDir = 'public/upload/';
        var filePath = uploadDir + filename + random +".xlsx";

        fs.writeFile(filePath, result, 'binary', function (err) {
            if(err){
                console.log(err);
            }
        })
        res.redirect("/admin");
    })
})

router.post('/statusChange', function (req, res, next) {
    dbHelper.studentStatusChange(req.body.studentNo, req.body.newStatus, function (success, doc) {
        res.send(doc);
    })
})

//状态跳转 并且在数据库中更新
router.get('/getOffline', function (req, res, next) {
    var studentNo = req.cookies.userNumber;
    dbHelper.studentStatusChange(studentNo, "offline", function (success, doc) {
        res.redirect("/");
    })
})

router.get('/getOnline', function (req, res, next) {
    var studentNo = req.cookies.userNumber;
    dbHelper.studentStatusChange(studentNo, "online", function (success, doc) {
        res.redirect("/student");
    })
})

router.get('/getFinishedOffline', function (req, res, next) {
    var studentNo = req.cookies.userNumber;
    dbHelper.studentStatusChange(studentNo, "finished", function (success, doc) {
        res.redirect("/");
    })
})



//暂存用的一个路由
router.get('/savetest', function (req, res, next) {
    var newTest = new Test({
        subjectName: "science",
        teacher: "May",
        startTime: "2016-12-19 12:30:00",
        lastTime: 30,
        children: [{
            questionNo:1,
            statement: "通常所说的“白色污染”指的是",
            answer: "聚乙烯等塑料垃圾",
            value: 20,
        }, {
            questionNo:2,
            statement: "啤酒的度数是指",
            answer: "100克麦芽汁中含糖类的克数",
            value: 20,
        },{
            questionNo:3,
            statement: "变脸是哪个剧种的绝活",
            answer: "川剧",
            value: 20,
        },{
            questionNo:4,
            statement: "贝加尔湖是最深的湖泊?",
            answer: "是",
            value: 20,
        }]
    });
    newTest.save(function (err, doc) {
        if(err){
            console.log(err);
        } else {
            console.dir(doc);
        }
    })
})

module.exports = router;
