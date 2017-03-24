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
var Route = require('./db/schema/route');
var Flight = require('./db/schema/flight');


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

// 获取航线函数
function queryRoutes() {
    superAgent.get('http://www.flyscoot.com/zh/')
        .end(function (err, res) {
            if (err) {
                console.error(err);
            }
            var $ = cheerio.load(res.text);
            var cityPairData = $("#city_pairs_data").html();
            cityPairData = JSON.parse(cityPairData);
            // get all the existing routes
            var _routes = [];
            for (var i = 0; i < cityPairData.length; i++) {
                for (var j = 0; j < cityPairData[i].length; j++) {
                    for (var k = 0; k < cityPairData[i][j].markets.length; k++) {
                        for (var l = 0; l < cityPairData[i][j].markets[k].destinations.length; l++) {   //destination country
                            var departCityName = cityPairData[i][j].markets[k].origin.station_name;
                            var departCityCode = cityPairData[i][j].markets[k].origin.station_code;
                            for (var m = 0; m < cityPairData[i][j].markets[k].destinations[l].destinations.length; m++){
                                var arrivalCityName = cityPairData[i][j].markets[k].destinations[l].destinations[m].station_name;
                                var arrivalCityCode = cityPairData[i][j].markets[k].destinations[l].destinations[m].station_code;
                                var newRoute = new Route({
                                    'departCity': departCityName,
                                    'departCode': departCityCode,
                                    'arrivalCity': arrivalCityName,
                                    'arrivalCode': arrivalCityCode,
                                    'expired': false,
                                });
                                _routes.push(newRoute);
                            }
                        }
                    }
                }
            }
            async.mapLimit(_routes,1, function (_route, callback) {
                    Route.find({
                        departCode: _route.departCode,
                        arrivalCode: _route.arrivalCode,
                    }, function (err, doc) {
                        if (doc.length === 0) {
                            _route.save(function (err, data) {
                                if (err) {
                                    console.error(err);
                                    console.log('save error');
                                } else {
                                    console.log('record a new route from ' + data.departCity + ' to ' + data.arrivalCity + ' successful!');
                                }
                            });
                        } else {
                            console.log('duplicate record');
                        }
                        callback(null, 'one');
                    });
            }, function (err ,result) {
                console.log(result);
                console.log('all routes have been recorded!');
            })
        });
}

// 执行获取航线函数
// queryRoutes();

var scootURL = 'http://makeabooking.flyscoot.com/Book';

var scootHeaders = {
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

// 发送数据的模板
var FormData = {
    'revAvailabilitySearch.SearchInfo.Direction': 'Oneway',
    'revAvailabilitySearch.SearchInfo.SearchStations[0].DepartureStationCode': '',
    'revAvailabilitySearch.SearchInfo.SearchStations[0].ArrivalStationCode': '',
    'revAvailabilitySearch.SearchInfo.SearchStations[0].DepartureDate': '',
    'revAvailabilitySearch.SearchInfo.AdultCount': 1,
    'revAvailabilitySearch.SearchInfo.ChildrenCount': 0,
    'revAvailabilitySearch.SearchInfo.InfantCount': 0,
    'revAvailabilitySearch.SearchInfo.PromoCode': '',
};

//日期输出格式化 ————> MM/DD/YYYY
Date.prototype.Format = function(formatStr)
{
    var str = formatStr;

    str=str.replace(/yyyy|YYYY/,this.getFullYear());
    str=str.replace(/yy|YY/,(this.getYear() % 100)>9?(this.getYear() % 100).toString():'0' + (this.getYear() % 100));

    var thisMonth = this.getMonth() + 1;
    str=str.replace(/MM|mm/,thisMonth>9?thisMonth.toString():'0' + thisMonth);
    str=str.replace(/M|m/g,this.getMonth());

    str=str.replace(/dd|DD/,this.getDate()>9?this.getDate().toString():'0' + this.getDate());
    str=str.replace(/d|D/g,this.getDate());
    return str;
}

//计算往后的日期  返回值格式: MM/DD/YYYY
function theDayAfter(day) {
    var today = new Date();
    var targetDay_milliseconds = today.getTime() + 1000*24*60*60*day;
    var targetDay = new Date();
    targetDay.setTime(targetDay_milliseconds);
    return targetDay.Format('mm/dd/yyyy');
}

// 深度拷贝"请求数据模板(FormData)" 并修改新的参数
function generateNewFormData(departC, arrivalC, departDate) {
    var thisRoute = JSON.stringify(FormData);
    thisRoute = JSON.parse(thisRoute);
    thisRoute['revAvailabilitySearch.SearchInfo.SearchStations[0].DepartureStationCode'] = departC;
    thisRoute['revAvailabilitySearch.SearchInfo.SearchStations[0].ArrivalStationCode'] = arrivalC;
    thisRoute['revAvailabilitySearch.SearchInfo.SearchStations[0].DepartureDate'] = departDate;
    return thisRoute;
}

// 生成查询日历,从今天起的三个月 90天
var calendar = [];
function generateCalendar() {
    for(var i = 0; i < 90 ; i++ ){
        calendar.push(theDayAfter(i));
    }
}
generateCalendar();


function queryFlightsForAllRoutes(startIdx, endIdx) {
    Route.find({expired: false}, function (err, routes) {
        if (err) {
            console.error(err);
        }
        if (routes.length !== 0) {
            // 获取所有航线(共3657条)
            // 取1000与总路线的较小值
            if(routes.length < endIdx){
                endIdx = routes.length;
            }
            routes = routes.slice(startIdx, endIdx);   // slice参数是元素下标
            async.mapLimit(routes, 1, function f1(route , callback) {
                // 同时并发10个date查询
                async.mapLimit(calendar, 1, function f3(departureDate, callback) {
                    // build new Formdata
                    var queryFormData = generateNewFormData(route.departCode, route.arrivalCode, departureDate);
                    queryFlightsForOneRoute(queryFormData, function (err, result) {
                        // console.log(result);
                        callback(null, result);
                    })
                },function f4(err , results) {
                    //保存所有的当日航班    results: json数组的数组
                    for(var i = 0; i < results.length; i++){
                        if(results[i].length !== 0){
                            for(var j = 0; j < results[i].length; j++){
                                // 此处是否有必要查重
                                (results[i][j]).save(function (err, data) {
                                    if (err){
                                        console.log('save err');
                                    }else {
                                        console.log('save success');
                                    }
                                })
                            }
                        } 
                    }
                    // 修改expired值
                    Route.update({departCode:route.departCode, arrivalCode:route.arrivalCode}, {$set: {expired:true}}, function (err, data) {
                        if (err){
                            console.log('fail to update');
                        }else {
                            console.log('success to update');
                        }
                    });

                });
                callback(null, 'one');
            },function f2(err, results) {
                if (err){
                    console.log('3000 err');
                } else {
                    console.log('3000条航线查完了');
                    console.log(results);
                }
            })
        }
        });
}

// queryFlightsForAllRoutes(0,0);

// console.log([0,1,2,3,4,5,6,7,8,9,10].slice(1,10));


function waterfall() {
    async.waterfall([function (cb) {
        queryFlightsForAllRoutes(0, 1000);
        cb(null, 'one');
    }, function (data, cb) {
        queryFlightsForAllRoutes(0, 1000);
        cb(null, 'two');
    }, function (data, cb) {
        queryFlightsForAllRoutes(0, 1000);
        cb(null, 'three');
    }, function (data, cb) {
        queryFlightsForAllRoutes(0, 1000);
        cb(null, 'four');
    }],function (err, result) {
        if(err){
            console.log(err);
        }else {
            console.log(result);
        }
    });
}

waterfall();



/*关于回调函数的回调方式的测试*/
var testData = {
    'revAvailabilitySearch.SearchInfo.Direction': 'Oneway',
    'revAvailabilitySearch.SearchInfo.SearchStations[0].DepartureStationCode': 'HGH',
    'revAvailabilitySearch.SearchInfo.SearchStations[0].ArrivalStationCode': 'SYD',
    'revAvailabilitySearch.SearchInfo.SearchStations[0].DepartureDate': '03/31/2017',
    'revAvailabilitySearch.SearchInfo.AdultCount': 1,
    'revAvailabilitySearch.SearchInfo.ChildrenCount': 0,
    'revAvailabilitySearch.SearchInfo.InfantCount': 0,
    'revAvailabilitySearch.SearchInfo.PromoCode': '',
};
function aaa(str,cb) {
    superAgent.post(scootURL)
        .set(scootHeaders)
        .type('form')
        .send(testData)
        .end(function (err, data) {
            console.log('我 post 过了');
            if(str == 'question2'){
                cb(null, '你猜猜');
            }else{
                cb(null, '我不猜');
            }
            cb(null, '盖掉桥面的');
        })
}
function bbb() {
    aaa('question',function (err, string) {
        console.log('in bbb');
        console.log(string);
    });
}
// bbb();



//用于测试nodejs最大调用栈    15703
function computeMaxCallStackSize() {
    try {
        return 1 + computeMaxCallStackSize();
    } catch (e) {
        // Call stack overflow
        return 1;
    }
}
// var a  = computeMaxCallStackSize();
// console.log(a);

//查询某个航线的某一天的航班
function queryFlightsForOneRoute(FormData, cb) {
    var flights = [];           // store one day's flights
    superAgent.post(scootURL)
        .set(scootHeaders)
        .type('form')
        .send(FormData)
        .end(function (err, res) {
            if (err) {
                return console.error(err);
                cb(null, []);
            }
            var $ = cheerio.load(res.text);
            // 查询当天的航班
            $('#departure-results .flight-results__result').each(function (index, element) {
                var $element = $(element);
                var departCity = $element.find('.flight__from li').eq(1).text();
                var departTime = $element.find('.flight__from li').eq(0).text() + $element.find('.flight__from li').eq(2).text();
                var flightInfo = $element.find('.flight__stop div').eq(0).attr('data-content');
                var flightDuration = $element.find('.flight-stop p').text();
                var arrivalCity = $element.find('.flight__to li').eq(1).text();
                var arrivalTime = $element.find('.flight__to li').eq(0).text() + $element.find('.flight__to li').eq(2).text();
                var flightPrice = $element.find('.flight__fly button span').text();
                var flightBizPrice = $element.find('.flight__scootbiz button span').eq(0).text()||'';
                flightPrice = flightPrice.replace(',','');
                flightPrice = flightPrice.replace('CNY','');
                flightPrice = Number(flightPrice);
                flightBizPrice = flightBizPrice.replace(',','');
                flightBizPrice = flightBizPrice.replace('CNY','');
                flightBizPrice = Number(flightBizPrice);
                var newFlight = new Flight({
                    'departCity': departCity,
                    'departTime': departTime,
                    'arrivalCity': arrivalCity,
                    'arrivalTime': arrivalTime,
                    'flightPrice': flightPrice,
                    'flightBizPrice': flightBizPrice,
                    'flightInfo': parseHtmlToText(flightInfo),
                    'flightDuration': flightDuration,
                });
                flights.push(newFlight);
            });
            // console.log(flights);
            if (flights.length == 0){
                console.log('today find no flight');
            } else {
                console.log('today has flights');
                // console.log(flights);
            }
            cb(null, flights);
        })
}

//去除html代码段中的标签
function parseHtmlToText(str) {
    var reTag = /<(?:.|\s)*?>/g;
    return str.replace(reTag, '').replace(/\s/g, "");
}

//拼接两个json数组
function combineTwoArray(array1, array2){
    var array = JSON.stringify(array1) + JSON.stringify(array2);
    array = array.replace('][',',');
    array = array.replace('[,','[');
    return JSON.parse(array);
}


// var a = [{dc:'aaa',ac:'bbb'},{dc:'ccc',ac:'ddd'}];
// var b = [{dc:'aaa',ac:'bbb'},{dc:'ccc',ac:'ddd'}];
// // combineTwoArray(a,b);
// var c = JSON.stringify(a)+JSON.stringify(b);
// c = c.replace('][', ',');
// console.log(JSON.parse(c));



// console.log(combineTwoArray(a,b));

function queryMobileCtrip() {
    superAgent.post('https://sec-m.ctrip.com/restapi/soa2/11782/Flight/International/FlightListV2/Query?_fxpcqlniredt=09031109310226923413')
        .set({
            'Accept': 'application/json',
            'Origin': 'http://m.ctrip.com',
            'Accept-Encoding': 'application/json',
            'Accept-Language': 'zh-CN,zh;q=0.8,en;q=0.6',
            'Connection': 'keep-alive',
            'Referer': 'http://m.ctrip.com/html5/flight/matrix-list-intl.html?dcity=BJS&acity=TYO&dport=&aport=&trip=1&ddate1=2017-03-22&ddate2=&adult=1&child=0&baby=0&seo=0&finaltime=1490025600000&from=http%3A%2F%2Fm.ctrip.com%2Fwebapp%2Fflightswift%2Findex',
            'Content-Type': 'application/json',
            'cookieorigin': 'http://m.ctrip.com',
            'cookie': '_fpacid=09031108110130786513; Union=OUID=&AllianceID=309318&SID=788043&SourceID=2578&Expires=1490700461111; _abtest_userid=cdcdf421-ec8d-49dc-aee6-9d725a30c00d; GUID=09031108110130786513; cticket=E545453C077249AD849349451DAB3961DE8734899DD298BF3C0611910698EB1A; DUID=1D47ADECE84AF35575C957C04D320707; IsNonUser=T; NSC_WT_Hbufxbz_8443=ffffffff0907d30645525d5f4f58455e445a4a423660; NSC_WT_Tfd-n_443=ffffffff0900850645525d5f4f58455e445a4a423660; MKT_Pagesource=H5; _jzqco=%7C%7C%7C%7C%7C1.1525075334.1490095661167.1490097529910.1490098011073.1490097529910.1490098011073.0.0.0.14.14; _ga=GA1.2.619814558.1490095661; _gat=1; _bfa=1.1490095660797.2h9k7t.1.1490095660797.1490095660797.1.18; _bfs=1.18; _bfi=p1%3D600003404%26p2%3D0%26v1%3D18%26v2%3D17',
            'User-Agen': 'Mozilla/5.0 (iPhone; CPU iPhone OS 9_1 like Mac OS X) AppleWebKit/601.1.46 (KHTML, like Gecko) Version/9.0 Mobile/13B143 Safari/601.1'
        })
        .send({
            "grade": 0,
            "osource": 1,
            "params": [{"typ": 1, "val": 7}, {"typ": 3, "val": 1}],
            "psglst": [{"psgtype": 1, "psgcnt": "1"}],
            "prdid": "",
            "segno": 1,
            "segs": [{"dcity": "SHA", "acity": "TYO", "ddate": "2017-03-24", "segno": 1}],
            "sortinfo": {"idx": 1, "size": 100, "ordby": 105, "meyordby": 2, "dir": 2, "token": ""},
            "triptype": 1,
            "ver": 0,
            "head": {
                "cid": "09031109310226923413",
                "ctok": "",
                "cver": "1.0",
                "lang": "01",
                "sid": "8888",
                "syscode": "09",
                "auth": null,
                "extension": [{"name": "protocal", "value": "http"}]
            },
            "contentType": "json"
        })
        .end(function (err, res) {
            if (err) {
                console.log(err)
            }
            var d = JSON.parse(res.text);
            console.log(d.segs[0].flgs[0]);
        });
}


module.exports = app;
