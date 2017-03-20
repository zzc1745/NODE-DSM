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


// 获取城市代码

// superAgent.get('http://www.flyscoot.com/zh/')
//     .end(function (err, res) {
//         if(err){
//             console.error(err);
//         }
//         console.log('get pages!');
//         var $ = cheerio.load(res.text);
//         var cityPairData = $("#city_pairs_data").html();
//         cityPairData = JSON.parse(cityPairData);
//         // grasp all the existing routes
//         for(var i = 0; i < cityPairData.length ; i++){
//             for(var j = 0; j < cityPairData[i].length; j++ ){
//                 for(var k = 0; k < cityPairData[i][j].markets.length; k++){
//                     var departCityName = cityPairData[i][j].markets[k].origin.station_name;
//                     var departCityCode = cityPairData[i][j].markets[k].origin.station_code;
//                     for(var l = 0; l < cityPairData[i][j].markets[k].destinations.length ; l++){   //destination country
//                         for(var m = 0; m < cityPairData[i][j].markets[k].destinations[l].destinations.length ; m++){
//                               var arrivalCityName = cityPairData[i][j].markets[k].destinations[l].destinations[m].station_name;
//                               var arrivalCityCode = cityPairData[i][j].markets[k].destinations[l].destinations[m].station_code;
//                             console.log('pushing.....');
//                             var newRoute = new Route({
//                                 'departCity' : departCityName,
//                                 'departCode' : departCityCode,
//                                 'arrivalCity' : arrivalCityName,
//                                 'arrivalCode' : arrivalCityCode,
//                                 'expired' : false,
//                             })
//                             newRoute.save(function (err, data) {
//                                 if (err){
//                                     console.error(err);
//                                 }else {
//                                     console.log('record a new route from '+ data.departCity + ' to ' + data.arrivalCity +' successful!');
//                                 }
//                             })
//                         }
//                     }
//                 }
//             }
//         }
//     })



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

// var FormData = {
//     'revAvailabilitySearch.SearchInfo.Direction':'Oneway',
//  'revAvailabilitySearch.SearchInfo.SearchStations[0].DepartureStationCode':'SHE',
//  'revAvailabilitySearch.SearchInfo.SearchStations[0].ArrivalStationCode':'SIN',
// 'revAvailabilitySearch.SearchInfo.SearchStations[0].DepartureDate':'04/12/2017',
//  'revAvailabilitySearch.SearchInfo.AdultCount':1,
//  'revAvailabilitySearch.SearchInfo.ChildrenCount':0,
//  'revAvailabilitySearch.SearchInfo.InfantCount':0,
//  'revAvailabilitySearch.SearchInfo.PromoCode':'',
// };

var data = {};
data['revAvailabilitySearch.SearchInfo.Direction'] = 'Oneway';
data['revAvailabilitySearch.SearchInfo.SearchStations[0].DepartureStationCode'] = 'SHE';
data['revAvailabilitySearch.SearchInfo.SearchStations[0].ArrivalStationCode'] = 'SIN';
data['revAvailabilitySearch.SearchInfo.SearchStations[0].DepartureDate'] = '04/17/2017';
data['revAvailabilitySearch.SearchInfo.AdultCount'] = 1;
data['revAvailabilitySearch.SearchInfo.ChildrenCount'] = 0;
data['revAvailabilitySearch.SearchInfo.InfantCount'] = 0;
data['revAvailabilitySearch.SearchInfo.PromoCode'] = '';

// console.log(data);


var flights = [];
// superAgent.post(reqURL)
//     .set(headers)
//     .type('form')
//     .send(data)
//     .end(function (err ,res ) {
//     if(err){
//         return console.error(err);
//     }
//         var flights = [];
//     var $ = cheerio.load(res.text);
//         $('#departure-results .flight-results__result').each(function (index , element) {
//             var $element = $(element);
//             var departCity = $element.find('.flight__from li').eq(1).text();
//             var departTime = $element.find('.flight__from li').eq(0).text() + $element.find('.flight__from li').eq(2).text();
//             var flightInfo = $element.find('.flight__stop div').eq(0).attr('data-content');
//             var flightDuration = $element.find('.flight-stop p').text();
//             var arrivalCity = $element.find('.flight__to li').eq(1).text();
//             var arrivalTime = $element.find('.flight__to li').eq(0).text() + $element.find('.flight__to li').eq(2).text();
//             var flightPrice = $element.find('.flight__fly button span').text();
//             var flightBizPrice = $element.find('.flight__scootbiz button span').text();
//             // console.log(departCity);
//             // console.log(departTime);
//             // console.log(arrivalCity);
//             // console.log(arrivalTime);
//             // console.log(flightPrice);
//             // console.log(flightBizPrice);
//             // console.log(parseHtmlToText(flightInfo));
//             // console.log(flightDuration);
//             flights.push({
//                 dc:departCity,
//                 dt:departTime,
//                 ac:arrivalCity,
//                 at:arrivalTime,
//                 price:flightPrice,
//                 bp:flightBizPrice,
//                 fi:parseHtmlToText(flightInfo),
//                 fd:flightDuration,
//             });
//         })
//     console.log(flights);
//         fs.writeFile('aaa.txt',JSON.stringify(flights), function (err,data) {
//             if(err){
//               console.error(err);
//             }
//         })
// })



//去除html代码段中的标签
function parseHtmlToText(str) {
    var reTag = /<(?:.|\s)*?>/g;
    return str.replace(reTag, '').replace(/\s/g, "");
}


//
// superAgent.get('http://flight.qunar.com/twell/flight/inter/search')
//     .query({
//         // "depCity": "杭州",
//         // "arrCity": "东京",
//         // "depDate": "2017-05-12",
//         // "adultNum": "1",
//         // "childNum": "0",
//         // "ex_track": "",
//         // "from": "flight_int_search",
//         // "queryId": "10.88.169.238:-19943e88:15adb324836:1285",
//         // "es": "MP1oZ3tuFxtoZgguJ5BTZotOFx7VZ19uOPHVZDa V 1OZDaO|1479811022546"
//
//
//     "depCity": "杭州",
//     "arrCity": "东京",
//     "depDate": "2017-05-12",
//     "adultNum": "1",
//     "childNum": "0",
//     "ex_track": "",
//     "from": "qunarindex",
//     // "queryId": "10.88.169.238:-4b17cd54:15adbe4d1f4:-1c0",
//     // "es": "MP1vZgaOMx7OZg9OJ5BTZotOFx7vZgtOFPtoZDa+V+1MSDaO|1479811022546"
//
//     })
//     .set({
//         // "postman-token": "766c583c-1a8f-44d8-ece0-fa3b9a64ec49",
//         // "cache-control": "no-cache",
//         // "x-requested-with": "XMLHttpRequest",
//         // "user-agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.6 Safari/537.36",
//         // "referer": "http://flight.qunar.com/site/oneway_list_inter.htm?searchDepartureAirport=%E6%9D%AD%E5%B7%9E&searchArrivalAirport=%E4%B8%9C%E4%BA%AC&searchDepartureTime=2017-05-12&searchArrivalTime=2017-05-19&nextNDays=0&startSearch=true&fromCode=HGH&toCode=TYO&from=flight_int_search&lowestPrice=null&favoriteKey=&showTotalPr=null&adultNum=1&childNum=0&cabinClass=",
//         // "host": "flight.qunar.com",
//         // "cookie": "QN99=8038; QN1=eIQjmVi/4GwO/JWTA28OAg==; csrfToken=JaYTR4R4YotikbQms6XTYGaLiGq51T4I; QunarGlobal=10.86.213.164_69b37dbc_15aad7700b2_-260b|1488969836863; QN269=E5A58D10C29011E6BCC9FA163E136BBD; QN601=e96b6690b32072011ecab7aed74eb8d8; PHPSESSID=a7tsbmd2g464gp7nhisvmg89g1; QN48=tc_da1c549a434a5b73_15aad8ae70e_ac0d; SplitEnv=D; QN170=101.69.228.227_a2c6ff_0_OY%2Biw%2BLVL11uJGb2i73ESCdccekwmVE%2BWYgx6Jwic8Y%3D; QN70=0586140c315ab2446de3; __utma=183398822.752614415.1489049518.1489049518.1489049518.1; __utmc=183398822; __utmz=183398822.1489049518.1.1.utmcsr=baidu|utmccn=(organic)|utmcmd=organic|utmctr=%E5%8E%BB%E5%93%AA%E5%84%BF; pgv_pvi=2815552512; pgv_si=s8263206912; QN268=1489049513436_479ba17fe11aef99|1489049515301_5c38ddcd4da8ded3; QN25=466565ae-dea5-4c7f-9ff0-69adff70fb2c-9f992f90; QN205=organic; QN163=0; Hm_lvt_75154a8409c0f82ecd97d538ff0ab3f3=1488970245,1488975933; Hm_lpvt_75154a8409c0f82ecd97d538ff0ab3f3=1489653063; flight.trends=%u5317%u4EAC-%u4E0A%u6D77%3B%u5317%u4EAC-%u5E7F%u5DDE; QN621=fr%3Dflight_int_search; _i=RBTKSusIJ5_x6cnTsGSrBScCx1ex; _vi=96h1g2nl_JSHAicZO_LnmsC-GukHa5h4V5mT_hR5GsXri6lMadqGBI33CNEspoxqRc6LpAiTjs9mHXmilLKinqCHrIrd2-_LrZMxSrh6tVcWRBSmQk0yquXtQ2swCrYVgLFXozccxBJNcIXiokeE88kYqaTU-YPaSym73Y62He5Z",
//         // "content-type": "application/x-www-form-urlencoded",
//         // "connection": "keep-alive",
//         // "accept-language": "zh-CN,zh;q=0.8,en;q=0.6,zh-TW;q=0.4",
//         // "accept-encoding": "gzip, deflate, sdch",
//         // "accept": "text/javascript, text/html, application/xml, text/xml, */*"
//         "accept-language": "zh-CN,zh;q=0.8,en;q=0.6,zh-TW;q=0.4",
//         "accept-encoding": "gzip, deflate, sdch",
//         "referer": "http://flight.qunar.com/site/oneway_list_inter.htm?searchDepartureAirport=%E6%9D%AD%E5%B7%9E&searchArrivalAirport=%E4%B8%9C%E4%BA%AC&searchDepartureTime=2017-05-12&searchArrivalTime=2017-05-19&nextNDays=0&startSearch=true&fromCode=HGH&toCode=TYO&from=qunarindex&lowestPrice=null&favoriteKey=&showTotalPr=null&adultNum=1&childNum=0&cabinClass=",
//         "content-type": "application/x-www-form-urlencoded",
//         "user-agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.6 Safari/537.36",
//         // "x-devtools-request-id": "12275.399",
//         // "x-requested-with": "XMLHttpRequest",
//         // "x-devtools-emulate-network-conditions-client-id": "c1f73609-b19f-4193-9384-ea783f7161d0",
//         "accept": "text/javascript, text/html, application/xml, text/xml, */*"
//     })
//     .end(function (err, res) {
//         if (res.error)
//             throw new Error(res.error);
//         console.log(res.body);
//     });



superAgent.get('http://flight.qunar.com/twell/flight/inter/search')
    .query({
        "depCity": "杭州",
        "arrCity": "静冈",
        "depDate": "2017-05-12",
        "adultNum": "1",
        "childNum": "0",
        "ex_track": "",
        "from": "flight_int_search",
    })
    .set({
        // "postman-token": "766c583c-1a8f-44d8-ece0-fa3b9a64ec49",
        // "cache-control": "no-cache",
        // "x-requested-with": "XMLHttpRequest",
        // "user-agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.6 Safari/537.36",
        //利用UTF-8解码
        // "referer": "http://flight.qunar.com/site/oneway_list_inter.htm?searchDepartureAirport=%E6%9D%AD%E5%B7%9E&searchArrivalAirport=E4%B8%9C%E4%BA%AC&searchDepartureTime=2017-05-12&searchArrivalTime=2017-05-19&nextNDays=0&startSearch=true&fromCode=HGH&toCode=TYO&from=flight_int_search&lowestPrice=null&favoriteKey=&showTotalPr=null&adultNum=1&childNum=0&cabinClass=",
        "referrr": "http://flight.qunar.com/site/oneway_list_inter.htm?searchDepartureAirport=%E6%9D%AD%E5%B7%9E&searchArrivalAirport=%E9%9D%99%E5%86%88&searchDepartureTime=2017-05-12&searchArrivalTime=2017-05-19&nextNDays=0&startSearch=true&fromCode=HGH&toCode=FSZ&from=qunarindex&       lowestPrice=null&favoriteKey=&showTotalPr=null&adultNum=1&childNum=0&cabinClass=",
        "host": "flight.qunar.com",
        "cookie": "QN99=8038; QN1=eIQjmVi/4GwO/JWTA28OAg==; csrfToken=JaYTR4R4YotikbQms6XTYGaLiGq51T4I; QunarGlobal=10.86.213.164_69b37dbc_15aad7700b2_-260b|1488969836863; QN269=E5A58D10C29011E6BCC9FA163E136BBD; QN601=e96b6690b32072011ecab7aed74eb8d8; PHPSESSID=a7tsbmd2g464gp7nhisvmg89g1; QN48=tc_da1c549a434a5b73_15aad8ae70e_ac0d; SplitEnv=D; QN170=101.69.228.227_a2c6ff_0_OY%2Biw%2BLVL11uJGb2i73ESCdccekwmVE%2BWYgx6Jwic8Y%3D; QN70=0586140c315ab2446de3; __utma=183398822.752614415.1489049518.1489049518.1489049518.1; __utmc=183398822; __utmz=183398822.1489049518.1.1.utmcsr=baidu|utmccn=(organic)|utmcmd=organic|utmctr=%E5%8E%BB%E5%93%AA%E5%84%BF; pgv_pvi=2815552512; pgv_si=s8263206912; QN268=1489049513436_479ba17fe11aef99|1489049515301_5c38ddcd4da8ded3; QN25=466565ae-dea5-4c7f-9ff0-69adff70fb2c-9f992f90; QN205=organic; QN163=0; Hm_lvt_75154a8409c0f82ecd97d538ff0ab3f3=1488970245,1488975933; Hm_lpvt_75154a8409c0f82ecd97d538ff0ab3f3=1489653063; flight.trends=%u5317%u4EAC-%u4E0A%u6D77%3B%u5317%u4EAC-%u5E7F%u5DDE; QN621=fr%3Dflight_int_search; _i=RBTKSusIJ5_x6cnTsGSrBScCx1ex; _vi=96h1g2nl_JSHAicZO_LnmsC-GukHa5h4V5mT_hR5GsXri6lMadqGBI33CNEspoxqRc6LpAiTjs9mHXmilLKinqCHrIrd2-_LrZMxSrh6tVcWRBSmQk0yquXtQ2swCrYVgLFXozccxBJNcIXiokeE88kYqaTU-YPaSym73Y62He5Z",
        "content-type": "application/x-www-form-urlencoded",
        "connection": "keep-alive",
        "accept-language": "zh-CN,zh;q=0.8,en;q=0.6,zh-TW;q=0.4",
        "accept-encoding": "gzip, deflate, sdch",
        "accept": "text/javascript, text/html, application/xml, text/xml, */*"
    })
    .end(function (err, res) {
        if (res.error)
            throw new Error(res.error);
        console.log(res.body);
    });


module.exports = app;
