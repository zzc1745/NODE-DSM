var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

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

var db = require('./db');
var superAgent = require('superagent');
var cheerio = require('cheerio');
var async = require('async');
var headers = {
  'Accept': 'text/html, application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
  'Accept-Encoding': 'gzip, deflate, sdch',
  'Accept-Language': 'zh-CN,zh;q=0.8,en;q=0.6,zh-TW;q=0.4',
  'Connection': 'keep-alive',
  'Cookie': 'JSSearchModel=0; LastCity%5Fid=653; LastCity=%e6%9d%ad%e5%b7%9e; _zg=%7B%22uuid%22%3A%20%2215b2d16654e3e2-0f2547cfc95a8d-69360970-fa000-15b2d16654f145%22%2C%22sid%22%3A%201491110094.161%2C%22updated%22%3A%201491110094.919%2C%22info%22%3A%201491110094169%7D; notlogin=1; BLACKSTRIP=yes; dywez=95841923.1491129886.2.2.dywecsr=other|dyweccn=121122523|dywecmd=cnt|dywectr=%E6%99%BA%E8%81%94%E6%8B%9B%E8%81%98; pcc=r=1508446004&t=1; urlfrom=121126445; urlfrom2=121126445; adfcid=none; adfcid2=none; adfbid=0; adfbid2=0; Hm_lvt_38ba284938d5eddca645bb5e02a02006=1491109684; Hm_lpvt_38ba284938d5eddca645bb5e02a02006=1491129904; LastJobTag=%e4%ba%94%e9%99%a9%e4%b8%80%e9%87%91%7c%e5%b8%a6%e8%96%aa%e5%b9%b4%e5%81%87%7c%e8%8a%82%e6%97%a5%e7%a6%8f%e5%88%a9%7c%e7%bb%a9%e6%95%88%e5%a5%96%e9%87%91%7c%e9%a4%90%e8%a1%a5%7c%e5%b9%b4%e5%ba%95%e5%8f%8c%e8%96%aa%7c%e5%91%98%e5%b7%a5%e6%97%85%e6%b8%b8%7c%e5%ae%9a%e6%9c%9f%e4%bd%93%e6%a3%80%7c%e9%ab%98%e6%b8%a9%e8%a1%a5%e8%b4%b4%7c%e5%85%a8%e5%8b%a4%e5%a5%96%7c%e5%bc%b9%e6%80%a7%e5%b7%a5%e4%bd%9c%7c%e5%8a%a0%e7%8f%ad%e8%a1%a5%e5%8a%a9%7c%e5%8c%85%e4%bd%8f%7c%e4%ba%a4%e9%80%9a%e8%a1%a5%e5%8a%a9%7c%e9%80%9a%e8%ae%af%e8%a1%a5%e8%b4%b4%7c%e5%8c%85%e5%90%83%7c%e5%b9%b4%e7%bb%88%e5%88%86%e7%ba%a2%7c%e8%82%a1%e7%a5%a8%e6%9c%9f%e6%9d%83%7c%e8%a1%a5%e5%85%85%e5%8c%bb%e7%96%97%e4%bf%9d%e9%99%a9%7c%e6%88%bf%e8%a1%a5%7c%e5%85%8d%e8%b4%b9%e7%8f%ad%e8%bd%a6%7c%e9%87%87%e6%9a%96%e8%a1%a5%e8%b4%b4; LastSearchHistory=%7b%22Id%22%3a%221e13e071-0e49-4048-bb60-9784cd25bd84%22%2c%22Name%22%3a%22%e6%9d%ad%e5%b7%9e+%2b+%e8%bd%af%e4%bb%b6%2f%e4%ba%92%e8%81%94%e7%bd%91%e5%bc%80%e5%8f%91%2f%e7%b3%bb%e7%bb%9f%e9%9b%86%e6%88%90%22%2c%22SearchUrl%22%3a%22http%3a%2f%2fsou.zhaopin.com%2fjobs%2fsearchresult.ashx%3fjl%3d%25e6%259d%25ad%25e5%25b7%259e%26sm%3d0%26isfilter%3d1%26p%3d1%26bj%3d160000%22%2c%22SaveTime%22%3a%22%5c%2fDate(1491130156667%2b0800)%5c%2f%22%7d; dywea=95841923.4471944747801439000.1491109684.1491109684.1491129886.2; dywec=95841923; dyweb=95841923.10.10.1491129886; __utma=269921210.2014231346.1491109684.1491109684.1491129887.2; __utmb=269921210.10.10.1491129887; __utmc=269921210; __utmz=269921210.1491129887.2.2.utmcsr=other|utmccn=121122523|utmcmd=cnt|utmctr=%E6%99%BA%E8%81%94%E6%8B%9B%E8%81%98; jobtypeopen=1',
  'Host': 'sou.zhaopin.com',
  'Referer': 'http://sou.zhaopin.com/jobs/searchresult.ashx?jl=%E6%9D%AD%E5%B7%9E&sm=0&isfilter=1&p=1&bj=160000',
  'Upgrade-Insecure-Requests': 1,
  'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3053.3 Safari/537.36};'
};
var data = {
  'jl':'杭州',
  'sm':0,
  'isfilter':1,
  'p':1,
  'bj':160000,
};

var detailPage = [];

function query(cb) {
    var jobType = [];
    console.log("query job types");
  superAgent.get("http://sou.zhaopin.com/jobs/searchresult.ashx?jl=%E6%9D%AD%E5%B7%9E&sm=0&isfilter=1&p=1&bj=160000")
      .set(headers)
      .end(function (err ,res) {
          if(err){
            console.log(err);
          }else {
            var $ = cheerio.load(res.text);
            $("#search_jobtype_tag a").each(function (index, link) {
                var $link = $(link);
                var newLink = {
                    href:$link.attr("href"),
                    desc:$link.text()
                };
                jobType.push(newLink);
            });
              //去除两个无用链接
              jobType.splice(0,2);
          }
          cb(null, jobType);
      })

}

//获取存有连续页码值的url
function getPageUrl(typeUrls, cb){
    console.log("get page url");
    async.mapLimit(typeUrls, 1, function (typeUrl , callback) {
        superAgent.get("http://sou.zhaopin.com" + typeUrl.href)
            .set(headers)
            .end(function (err, res) {
                if(err){
                    console.log(err);
                }else {
                    //判断时候还有下一页的href属性, 如果没有,就赋原址
                    var $ = cheerio.load(res.text);
                    var nextPageButton = $(".newlist_main .pagesDown-pos a");
                    if(nextPageButton.length > 0){
                        var newLink  = nextPageButton.attr('href');
                        var count = parseInt((typeUrl.desc).substring(typeUrl.desc.indexOf("(")+1, typeUrl.desc.indexOf(")")));
                        var newTypeUrl = {
                            url: newLink,
                            page: Math.ceil(count/60),
                        };
                    }else {
                        var newTypeUrl = {
                            url: 'http://sou.zhaopin.com' + typeUrl.href,
                            page: 1
                        }
                    }
                    callback(null, newTypeUrl);
                }
            })
    },function (err, result) {
        cb(null, result);
        });
}
var count = 0;
var dcount = 0;
//获得单个职位的url   输入单种职位的url+page
function getDetailUrl(typeUrl, callback) {
    count++;
    console.log("count = "+ count);
    var detailUrls = [];    //储存该工种的所有招聘详情页的的url
    if(typeUrl.page == 1){
        //抓当前页即可,不许修改p=?
        superAgent.get(typeUrl.url)
            .set(headers)
            .end(function (err, res) {
                if(err){
                    console.log(err);
                } else {
                    var $ = cheerio.load(res.text);
                    //获取当前序号页面中的links
                    $("#newlist_list_content_table table").each(function (index, element){
                        var $element = $(element);
                        var detailPageUrl = $element.find(".zwmc div a").attr('href');
                        if(typeof(detailPageUrl) !== undefined){
                            detailUrls.push(detailPageUrl);
                        }
                    })
                    setTimeout(function () {
                        callback(null, detailUrls);
                    },1000);
                }
            })
    }else {
        //获取从第一页到最后一页的序列地址  ==> links
        var originalLink = typeUrl.url.substring(0,typeUrl.url.length-1);
        var paginationLinks = [];
        for(var i = 1; i <= typeUrl.page ; i++){
            paginationLinks.push(originalLink+i);
        }
        // console.log("连续序号页面的url:");
        // console.log(paginationLinks);
        async.mapLimit(paginationLinks, 1, function (pageLink, cb) {
            superAgent.get(pageLink)
                .set(headers)
                .end(function (err, res) {
                    if(err){
                        console.log(err);
                    } else {
                        var $ = cheerio.load(res.text);
                        //获取当前序号页面中的60条links
                        $("#newlist_list_content_table table").each(function (index, element){
                            var $element = $(element);
                            var detailPageUrl = $element.find(".zwmc div a").attr('href');
                            if(index > 0){  //跳过第一个表头
                                detailUrls.push(detailPageUrl);
                            }
                        })
                        cb(null, 'oneDetailPageUrl');
                    }
                })
        },function (err, rs) {
            setTimeout(function () {
                callback(null, detailUrls);
            },1000);
        });
        }
}


var detailPageHeaders = {
        'Accept':'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
 'Accept-Encoding':'gzip, deflate, sdch',
 'Accept-Language':'zh-CN,zh;q=0.8,en;q=0.6,zh-TW;q=0.4',
 'Cache-Control':'max-age=0',
 'Connection':'keep-alive',
 'Cookie':'JSSearchModel=0; LastCity%5Fid=653; LastCity=%e6%9d%ad%e5%b7%9e;' +
 ' _zg=%7B%22uuid%22%3A%20%2215b2d16654e3e2-0f2547cfc95a8d-69360970-fa000-15b2d16654f145%22%2C%22sid%22%3A%201491110094.161%2C%22updated%22%3A%201491110094.919%2C%22info%22%3A%201491110094169%7D; notlogin=1; bdshare_firstime=1491110210070; pcc=r=1508446004&t=1; dywez=95841923.1491150015.5.4.dywecsr=sou.zhaopin.com|dyweccn=(referral)|dywecmd=referral|dywectr=undefined|dywecct=/jobs/searchresult.ashx; hiddenEpinDiv=none; urlfrom=121126445; urlfrom2=121126445; adfcid=none; adfcid2=none; adfbid=0; adfbid2=0; __utmt=1; LastSearchHistory=%7b%22Id%22%3a%22ca84743b-0b82-4aaf-a098-826ac3de1493%22%2c%22Name%22%3a%22%e6%9d%ad%e5%b7%9e+%2b+%e8%bd%af%e4%bb%b6%2f%e4%ba%92%e8%81%94%e7%bd%91%e5%bc%80%e5%8f%91%2f%e7%b3%bb%e7%bb%9f%e9%9b%86%e6%88%90%22%2c%22SearchUrl%22%3a%22http%3a%2f%2fsou.zhaopin.com%2fjobs%2fsearchresult.ashx%3fbj%3d160000%26jl%3d%25e6%259d%25ad%25e5%25b7%259e%26sm%3d0%26p%3d1%26source%3d0%22%2c%22SaveTime%22%3a%22%5c%2fDate(1491272329385%2b0800)%5c%2f%22%7d; dywea=95841923.4471944747801439000.1491109684.1491156668.1491272312.8; dywec=95841923; dyweb=95841923.5.10.1491272312; Hm_lvt_38ba284938d5eddca645bb5e02a02006=1491109684; Hm_lpvt_38ba284938d5eddca645bb5e02a02006=1491272337; __utma=269921210.2014231346.1491109684.1491156668.1491272312.8; __utmb=269921210.5.10.1491272312; __utmc=269921210; __utmz=269921210.1491150015.5.4.utmcsr=sou.zhaopin.com|utmccn=(referral)|utmcmd=referral|utmcct=/jobs/searchresult.ashx',
 'Host':'jobs.zhaopin.com',
 'Referer':'http://sou.zhaopin.com/jobs/searchresult.ashx?bj=160000&jl=%E6%9D%AD%E5%B7%9E&sm=0&p=1&source=0',
 'Upgrade-Insecure-Requests':1,
 'User-Agent':'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3053.3 Safari/537.36'
}

var oneJobUrl = 'http://jobs.zhaopin.com/650076925252835.htm';
//获得单个职位的详情
function getDetailInfo(jobUrl, callback) {
    dcount++;
    console.log("dcount = " + dcount);
    try {
    superAgent.get(jobUrl)
        .query({
            'ssidkey':'y',
            'ss':201,
            'ff':03,
        })
        .set(detailPageHeaders)
        .end(function (err, res) {
            if(err){
                console.log(err);
            } else {
                var $ = cheerio.load(res.text);
                // //获取页面中的dom
                var title = $(".top-fixed-box .inner-left");
                var jobTitle = $(title).find("h1").text();
                var company = $(title).find('a').text();
                var bonus = '';
                $(title).find("span").each(function (index, bonusSpan) {
                    var $bonusTag = $(bonusSpan);
                    // console.log($bonusTag.text());
                    bonus += $bonusTag.text()+ "、";
                })
                bonus = bonus.substr(0,bonus.length-1);
                var detail = $(".terminal-ul li");
                var salary = $(detail).eq(0).find('strong').text();
                var citylocation = $(detail).eq(1).find('strong').text();
                var publishDate = $(detail).eq(1).find('strong').text();
                var natureOfWork = $(detail).eq(3).find('strong').text();
                var experienceRequirement = $(detail).eq(4).find('strong').text();
                var eduRequirement = $(detail).eq(5).find('strong').text();
                var requiredNum = $(detail).eq(6).find('strong').text();
                var jobType = $(detail).eq(7).find('strong').text();
                var jobDesc = '';
                $(".tab-inner-cont p").each(function (index, pDesc) {
                    var $desc = $(pDesc);
                    jobDesc += $desc.text();
                })
                var workplaceLocation = $(".tab-inner-cont h2").text().replace('查看职位地图','').trim();
                var newZhaopin = {
                    jobTitle: jobTitle,
                    company: company,
                    bonus: bonus,
                    salary: salary,
                    cityLocation: citylocation,
                    publishDate: publishDate,
                    natureOfWork: natureOfWork,
                    expReq: experienceRequirement,
                    numReq: requiredNum,
                    jobType: jobType,
                    jobDesc: jobDesc,
                    workPlaceLocation: workplaceLocation
                }
                db.saveJobInfo(jobTitle,company,bonus,salary,citylocation,publishDate,natureOfWork,experienceRequirement,requiredNum,jobType,jobDesc,workplaceLocation);
                callback(null, newZhaopin);
            }
        })
    } catch(e){
        console.log('error.......');
        callback(null, {});
    }
}

function aaa() {
    getDetailInfo(oneJobUrl, function (err, data) {
        console.log(data);
    })
}
var fs = require('fs');
function doAsync() {
    async.waterfall([
        query,
        getPageUrl,
        function (initUrls, callback) {
            var allUrls = [];
            async.mapLimit(initUrls, 5, function (initUrl, callback) {
                getDetailUrl(initUrl,function (err, detailUrl) {
                    callback(null, detailUrl);   //单个工种的所有招聘信息的url连接
                });
            }, function (err, res) {
                for(var i = 0; i < res.length; i++){
                    allUrls = allUrls.concat(res[i]);
                }
                setTimeout(function () {
                    callback(null, allUrls);
                },5000);
            })
        },
        function (allUrls, callback) {
            // console.log(allUrls.length);
            // allUrls.splice(0,17000);
            async.mapLimit(allUrls, 10, function (url, callback) {
                // console.log("当前的序号是:");
                // console.log(allUrls.indexOf(url));
                if(allUrls.indexOf(url)%3000 == 0){
                    setTimeout(function () {
                        getDetailInfo(url, function (err, zhaopin) {
                            setTimeout(function () {
                                callback(null, zhaopin);
                            },500);
                        });
                        console.log('此处停留30秒');
                    },60000);
                }else {
                    getDetailInfo(url, function (err, zhaopin) {
                        setTimeout(function () {
                            callback(null, zhaopin);
                        },500);
                    })
                }
            }, function (err, res) {
                //res即为所需信息
                console.log(res.length);
                callback(null, res);
            })
        }
    ], function (err, res) {
        if (err) {
            console.log(err);
        } else {
            console.log("got it!");
            console.log(res.length);
        }
    })
}


db.connect();


// doAsync();


module.exports = app;
