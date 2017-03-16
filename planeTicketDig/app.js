var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var cheerio = require('cheerio');
var superAgent = require('superagent');
var fs = require('fs');
var eventproxy = require('eventproxy');
var async  = require('async');
var fs = require('fs');
var iconv = require('iconv-lite');


var cnodeUrl = 'https://cnodejs.org';


var index = require('./routes/index');
var users = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});



// superAgent.get(cnodeUrl)
//     .end(function (err, res) {
//       if(err){
//         return next(err);
//       }
//       //把数组声明移到内部
//       var topicUrls = [];
//       var $ = cheerio.load(res.text);
//       $('#topic_list .topic_title').each(function (index , element) {
//         var $element = $(element);
//         topicUrls.push(cnodeUrl + $element.attr('href'));
//       });
//
//       // 注册监听getContent事件
//       var ep = new eventproxy();
//       ep.after('getContent', 4, function (topics) {    //topic返回内容:[[url,抓取的html]]
//         // 在注册时间循环指定次数后,执行callback
//         // 把topics数组中的原数组元素更新为json数据
//         topics = topics.map(function (topicPair) {
//           var topicUrl = topicPair[0];
//           var topicHtml = topicPair[1];
//           var $ = cheerio.load(topicHtml);
//           return ({
//             title: $('.topic_full_title').text().trim(),
//             href: topicUrl,
//             content: $('.markdown-text').text(),
//           });
//
//         });
//           fs.writeFile('out.txt' ,topics[1].title, function (err) {
//               if(err){
//                   return console.error(err);
//               }
//           });
//         console.log('final:');
//         console.log(topics);
//       });
//
//       // 同步事件  抓取每一个url的内容
//       var index = 0;
//       topicUrls.forEach(function (topicUrl) {
//         index++;
//         if(index<=4){
//           superAgent.get(topicUrl)
//               .end(function (err, res) {
//                 console.log('fetch  ' + topicUrl +'  successful');
//                 ep.emit('getContent', [topicUrl, res.text]);
//               })
//         }
//
//       })
//
//     });


//使用async异步, 用于控制并发请求
// var concurrencyCount = 0;
// var fetchUrl = function (url, callback) {
//     var delay = parseInt((Math.random() * 1000000) % 2000, 10);
//     concurrencyCount ++;
//     console.log('现在的并发数是', concurrencyCount, '，正在抓取的是', url, '，耗时' + delay + '毫秒');
//     setTimeout(function () {
//         concurrencyCount --;
//         callback(null, url + 'html content');
//     }, delay);
// };
//
// var urls = [];
// for(var i = 0; i < 30 ; i++){
//     urls.push('http://datasource_' + i);
// }
// fs.writeFile('/Users/trick/Desktop/out.txt', urls, function (err) {
//   if(err){
//     console.log("err");
//     return console.error(err);
//   }
// } )
//
// async.mapLimit(urls, 5, function (url, callback) {
//     fetchUrl(url, callback);
// },function (err, result) {
//     console.log('final:');
//     console.log(result);
// })



var reqURL = 'http://makeabooking.flyscoot.com/Book';

var headers = {
    'Accept':'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
    'Accept-Encoding':'gzip, deflate',
 'Accept-Language':'zh-CN,zh;q=0.8,en;q=0.6,zh-TW;q=0.4',
 'Cache-Control':'max-age=0',
 'Connection':'keep-alive',
 'Content-Length':'477',
 'Content-Type':'application/x-www-form-urlencoded',
 'Cookie':'optimizelyEndUserId=oeu1489568228007r0.9741735616907052; ASP.NET_SessionId=h3y5jqpnntpd0dob1qghllp5; skysales=427483658.20480.0000; jumpseat_uid=ttJTz_q54if5Se3clR0lBV; dotrez=85123594.20480.0000; _gr_test_url=0; __utma=185425846.2028437347.1489568226.1489571802.1489579006.2; __utmc=185425846; __utmz=185425846.1489571802.1.1.utmcsr=(direct)|utmccn=(direct)|utmcmd=(none); startTime=MjAxNy0wMy0xNSAyMDozODozNg==; _ga=GA1.2.2028437347.1489568226; optimizelySegments=%7B%222335550040%22%3A%22gc%22%2C%222344180004%22%3A%22referral%22%2C%222354350067%22%3A%22false%22%2C%222355380121%22%3A%22none%22%7D; optimizelyBuckets=%7B%7D; optimizelyPendingLogEvents=%5B%5D',
 'Host':'makeabooking.flyscoot.com',
 'Origin':'http://makeabooking.flyscoot.com',
 'Referer':'http://makeabooking.flyscoot.com/Book/Flight',
 'Upgrade-Insecure-Requests':1,
 'User-Agent':'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.6 Safari/537.36'
};

var FormData = {
 'revAvailabilitySearch.SearchInfo.Direction':'Oneway',
 'revAvailabilitySearch.SearchInfo.SearchStations[0].DepartureStationCode':'SHE',
 'revAvailabilitySearch.SearchInfo.SearchStations[0].ArrivalStationCode':'BWN',
 'revAvailabilitySearch.SearchInfo.SearchStations[0].DepartureDate':'04/09/2017',
 'revAvailabilitySearch.SearchInfo.AdultCount':1,
 'revAvailabilitySearch.SearchInfo.ChildrenCount':0,
 'revAvailabilitySearch.SearchInfo.InfantCount':0,
 'revAvailabilitySearch.SearchInfo.PromoCode':'',
};

var flights = [];
superAgent.post(reqURL)
    .set(headers)
    .type('form')
    .send(FormData)
    .end(function (err ,res ) {
    if(err){
        return console.error(err);
    }
        var flights = [];
    var $ = cheerio.load(res.text);
        $('#departure-results .flight-results__result').each(function (index , element) {
            var $element = $(element);
            var departCity = $element.find('.flight__from li').eq(1).text();
            var departTime = $element.find('.flight__from li').eq(0).text() + $element.find('.flight__from li').eq(2).text();
            var flightInfo = $element.find('.flight__stop div').eq(0).attr('data-content');
            var flightDuration = $element.find('.flight-stop p').text();
            var arrivalCity = $element.find('.flight__to li').eq(1).text();
            var arrivalTime = $element.find('.flight__to li').eq(0).text() + $element.find('.flight__to li').eq(2).text();
            var flightPrice = $element.find('.flight__fly button span').text();
            console.log(departCity);
            console.log(departTime);
            console.log(arrivalCity);
            console.log(arrivalTime);
            console.log(flightPrice);
            console.log(parseHtmlToText(flightInfo));
            console.log(flightDuration);

            flights.push({
                dc:departCity,
                dt:departTime,
                ac:arrivalCity,
                at:arrivalTime,
                price:flightPrice,
                fi:parseHtmlToText(flightInfo),
                fd:flightDuration,
            });
        })
    console.log(flights);
        fs.writeFile('aaa.txt',JSON.stringify(flights), function (err,data) {
            if(err){
              console.error(err);
            }
        })
})



//去除html代码段中的标签
function parseHtmlToText(str) {
    var reTag = /<(?:.|\s)*?>/g;
    return str.replace(reTag, '').replace(/\s/g, "");
}


module.exports = app;
