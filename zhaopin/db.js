var mongoose = require('mongoose');
mongoose.Promise = Promise;
var db;
var Schema = mongoose.Schema;
var jobSchema = new Schema({
    jobTitle: String,
    company: String,
    bonus: String,
    salary: String,
    cityLocation: String,
    publishDate: String,
    natureOfWork: String,
    expReq: String,
    numReq: String,
    jobType: String,
    jobDesc: String,
    workPlaceLocation: String,
});


var mongo = require('mongodb').MongoClient;


exports.connect = function () {
    mongo.connect('mongodb://127.0.0.1:27017/zhaopin', function (err, database) {
        if(err){
            return;
        }
        console.log('connected to mongo');
        db = database;
    })

}

exports.disconnect = function () {
    db.close();
}


exports.saveJobInfo = function (jobTitle,company,bonus,salary,citylocation,publishDate,natureOfWork,exp,requiredNum,jobType,jobDesc,workplaceLocation) {
    var job = {
        jobTitle: jobTitle,
        company: company,
        bonus: bonus,
        salary: salary,
        cityLocation: citylocation,
        publishDate: publishDate,
        natureOfWork: natureOfWork,
        expReq: exp,
        numReq: requiredNum,
        jobType: jobType,
        jobDesc: jobDesc,
        workPlaceLocation: workplaceLocation,
    };
    var options = {
        upsert: true
    };
    var collection = db.collection('jobs');
    collection.updateOne(job, {$set:{jobTitle:job.jobTitle}}, options, function (err, res) {
        if(err){
            console.log(err);
        }else {
            console.log('insert success');
        }
    })
    // collection.insertOne(job, options , function (err, res) {
    //     if(err){
    //         console.log(err);
    //     }else {
    //         console.log('insert success');
    //     }
    // })
}


exports.reformJob = function () {
    var test = db.collection('testJob');
    var regx = /\d+/;
    test.updateOne({salary:regx}, function (err, data) {
        if (err){
            console.log(err);
        }else{
            console.log(data);
        }
    })
}

