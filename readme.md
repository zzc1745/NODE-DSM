# 学习日记

## 2016年7月2日
### js代码错误检查插件
1. 安装jshint:  
  `npm install jshint`  
  `npm install jshint --save-dev`  
2. js代码在线纠错  
  http://www.jslint.com/  

### 资料储备
1. nodejs生成pdf文档  
PDFKit（http://pdfkit.org/） 最专业的函数库，支持各种pdf文档的数据格式，只是使用起来比较复杂，适合专业开发者。  
Wkhtmltopdf（https://npmjs.org/package/wkhtmltopdf） 将HTML转化成pdf文档的引擎，使用起来非常方便简单  
PhantomJS（http://www.feedhenry.com/server-side-pdf-generation-node-js/） PhantomJS 是一个基于 WebKit 的服务器端 JavaScript API。它全面支持web而不需浏览器支持，其快速，原生支持各种Web标准： DOM 处理, CSS 选择器, JSON, Canvas, 和 SVG。 PhantomJS 可以用于 页面自动化 ， 网络监测 ， 网页截屏 ，以及 无界面测试 等。
<br/>
<br/>
2. 使用 Sublime + PlantUML 画出图示  
http://www.jianshu.com/p/e92a52770832  

2. 设置全局变量  
三种设置方法  
 --declare the variable without the var keyword  
 --add the variable to the global/GLOBAL object  
用var声明的变量：remain local to a module；  
不用var的变量： get attached to the global object.  
`全局变量方便，但是不适用于大型项目，使用其他方法替代全局变量：  

**eg:**  

*File: main.js*  
```js
exports.company = 'Google';
var m = require('./mod');
```
File: mod.js
```js
var company = require('./main').company;
console.log(company);
```
Now to see it in action:
```js
$ node main.js
Google
```
`

### 
---
## 2016年7月1日

### 自动添加依赖项到package.json
`spm install module-name -save` 自动把模块和版本号添加到dependencies部分  
`spm install module-name -save-dve` 自动把模块和版本号添加到devdependencies部分  
产品模式用dependencies，开发模式用devDep。  

### ajax函数的调用相关
参考资料：https://segmentfault.com/a/1190000002405469  


### chrome 调试断点技巧：
- `{ }`可以把压缩代码优化成可读性强的代码  
- `resume script execution` 恢复执行脚本  
- 打开js代码，设置/取消断点，右侧“breakpoints列表可以查看断点  
- 箭头加斜杠标识，表示临时禁用所有断点 
- call stack（调用栈），可以查看当前断点所处的方法调用栈，可以嵌套调用，也就是说可以含有断点的最外层函数也会被包含进来调用栈中的每一层叫做一个frame，点击每个frame可以跳到该frame的调用点上。  
- scope中查看变量具体的参数

###  node常用模块简介
参考资料：http://www.open-open.com/lib/view/open1409796214932.html  

###  增加新闻模块的debug心得
1. 出现数据库连接错误提示：trying to open unclosed database  
   原因：同一个数据库，不能打开两次
   >相关技术：如何同时连接多个数据库  
   `mongoose.connect()`只能连接一个数据库  
   `mongoose.createConnection()`可以同时连接多个数据库  
   参考资料：http://jayceefun.github.io/blog/2013/08/27/mongoose_multi_dbs/  

2. ajax无法从前台获得数据，传入后台  
   解决：明早具体补充  
   明早看关于全局变量的内容：http://www.hacksparrow.com/global-variables-in-node-js.html  


### 为加强理解，对nodejs项目框架分析

>bin  
......www : 创建web服务器，配置监听port  
>db  
......schema  
............news.js:新闻模型保存+记录保存预处理+将该模型输出到数据库的一张表中  
......user.js : 用户模型保存+记录保存预处理+将该模型输出到数据库的一张表中  
......db.js : 向控制台输出数据库的连接状态status  
......dbHelper.js : 获取`./schema`中的模型，findUsr函数（findOne匹配，输出结果到entries）和addNews函数（获取传入数据并转化到News模型数据+保存函数**不懂这个model.pre('save')函数的调用机制**）  
......jsonRes.js  
lib  
......hbsHelper.js : 获取moment模块，存储日期处理函数，并输出到外部供调用  
......webHelper.js : 获取remarkable模块，存储函数并输出到外部供调用（目测该模块的用处是高亮网页的error信息）  
node_modules:存放封装好的模块  
public  
......blog  
............addNews.js : 增加新闻的ajax函数调用，验证登录信息并完成跳转  
............login.js : 登录页面的ajax函数调用，调用发布提示  
......img : 存放图片  
......lib :  存档模板代码框架  
......stylesheets : 存放css  
route  
......admin.js : 存放/admin路径下的路由，有页面展示和数据调用函数  
......index.js : 根路径下的分支路由  
views  
......admin  
............news.hbs : 新增新闻页面的`改动部分`  
......error : 错误提示  
......layouts : 展示层的框架们  
......partials : 包含了`所有`页面内`不发生改动的部分`  
.......gitgnore   
......app.js : 项目的入口文件，配置模块引擎和默认静态资源映射  
......config.js : 配置站点信息，和数据库连接信息  
......package.json : 外部依赖项的路径  
```
update(2016.7.2):  
model.pre('save')函数的理解  
在/routes/admin.js路由文件中,调用addNews函数，可以把获取到的前台的数据存为news实例，成为一条可以被加进News表中的一条记录，并且通过addNew（）函数中包含的news.save函数，自动保存到表中。  

```
---

## 2016年6月30日    
### 登录模块调试总结
1. ajax通过html中的id属性获取元素内容  

2. 在后台插入数据，可以在`index.js`中新增一个空白页面，专用于插入数据记录，避免重复录入(在没有检查的情况下）  

3. 路由路径缩略符：  
   / :当前默认的静态映射  
   ./: 当前文件夹下  
   ../:回到上一层文件目录  

4. 对应的js可以包含在对应的hbs文件中   
 **此处存疑** 关于addBlog.js的包含问题 暂解决，未理解  

5. command+单击，进入变量、函数声明  
 
6. 断点调试的方法，仍然不太懂

### *node.js学习指南*PDF第五章（1-6节）学习总结  

#### app.js文件  
1. ```app.configure(function(){});```
通过回调函数，设置app对应的Express模块的参数
2. ```app.set();```   设置参数  
   ```app.use();```   启用中间件  
3. 心得体会：这几天学的内容繁多，对于新软件的使用也很不上手，很难理解页面的实现，之前主要靠重复调试得到想要的效果，对于原理仍然一知半解。今天在阅读书本之后，真正理解“app.js是入口文件”，整个项目文件，从app.js开始解析，首先获取模块，然后设置路由，接着在不同页面的跳转中，触发新的js文件，执行对应的函数，在控制台输出数据。项目从零碎的部件，得到线索能够串起来，对于理解上，有一个比较大的进步。
#### 路由文件
```js
exports.index=function(req,res){
    res.render('index',{title:'Express'});
    //定义一个函数，调用'index.hbs’模板解析引擎，产生页面返回浏览器
    //{title:'Express'}是传入的参数
};
```
####Express处理路由规则
1. 同一个路径(如'/login')可以绑定多个路由响应函数，但是按照顺序优先匹配第一个。
2. next()的用处，转移控制权，就是用于服务上述情况，从当前匹配的函数，跳转至下一个匹配路径的规则。
3. next()，也可以起到类似中间件的效果，提取相似请求的相同部分，结合页面模板和要显示的数据结合生成HTML。  
eg.验证用户名存在与否；存在则展出，不存在则输出error。验证部分就可以插入next()

### TotalFinder插件
#### 安装习得  
马克资源：mac优化工作环境必备一级棒 http://ju.outofmemory.cn/entry/217935 
​
#### 破解totalFinder：
1. 某个教程知道把/Library/ScriptingAdditions/TotalFinder.osax/Contents/Resources路径下的TotaFinder.bundle放入patch.app即可  
   因下载版本无patch.app文件更换破解方法
2. 重新下载文件，遇到文件损坏问题，打算等到过期再破....

#### 
连续两次遇到zip文件解压生成cpgz文件，cpgz解压后又生成zip文件
> 导致这种情况的原因有一下几点：  
   1. zip文件已经损坏；  
　　2. zip文件下载时没有下载完全；  
　　3. 浏览器在下载或者下载完成zip文件时，对其进行了错误处理；  
　　4. bug导致。  

首先验证一下你的zip文件md5 hash或者SHA1，如果校验显示不同，说明你的文件有损坏或者下载不完全。
> Tips：  
校验MD5 hash方法：打开终端，输入MD5，空格，然后输入需要验证的文件路径（可以直接将文件拖进去）  
校验sha1：打开终端，输入shasum，空格， 然后输入需要验证的文件路径（可以直接将文件拖进去）

验证结果：两个校验码不同，文件损坏  

#### 电脑重启，忘记启动mongodb导致无法连上数据库  
在mongodb根目录下配置路径为db   
mongod --dbpath /data/db  

---  

## 2016年6月29日

### json和ajax的回顾
json:封装数据
```javascript
    var jsonStr = "{\"a\":\"内容1\", \"b\":\"内容2\",\"c\":\"内容3\",\"d\":\"内容4\"}";
    //jsonStr是json类型的字符串
    var jsonObj = eval("(" + jsonStr + ")"); 
    //jsonObj是jquery对象
```
ajax:异步调用json数据对象，输出到html  
参考：http://www.php100.com/html/program/jquery/2013/0905/5912.html  

### 数据库交互的理解（登陆部分）
步骤：  
1. 定义数据模型，userSchema  
2. 声明模型可以使用的函数findUsr()与addUser()，并开放接口  
3. 在index.js中添加用户模块的路由  



### 问题整理
1. mongoose模块已经通过命令行install但无法require  
解决：  
确认已经在node_modules文件夹中添加模块文件  
在package.json文件中，还要再添加dev外部依赖项  

2. http之间的状态码  

|Type|  Reason-phrase| Note|
| ------------- |:-------------:|:-----|
|1XX |Informational  |信息性状态码，表示接受的请求正在处理|
|2XX |Success        |成功状态码，表示请求正常处理完毕|
|3XX |Redirection    |重定向状态码，表示需要客户端需要进行附加操作|
|4XX |Client Error   |  客户端错误状态码，表示服务器无法处理请求|
|5XX |Server Error   |  服务器错误状态码，表示服务器处理请求出错|

3.伪造数据与增删查改  

######通过entity创建记录
```javascript
var Schema = mongoose.Schema;
var personSchema = new Schema({
        name: String,
        password: String
    });
    var person = mongoose.model('person',personSchema);
    person1 = new person({
        name: 'jdppppp',
        password:'11fff'
    });
    person1.save(function (err,doc) {
        if(err){
            console.log('error')
        }else{
            console.log(doc)
        }
    })
```
###### 查询该实例前身的所有记录
```javascript
    Blog.find(function (err,blogs) {
        console.log(blogs);
    })
    person.find(function(err,persons){
        console.log(persons)
    });
```
###### 通过model调用create创建记录
```javascript
person.create({
        name: 'xxxjjj',
        password:'jkfdksajflkdsaf',//没有录入已有属性,则不输出
        email: '864741099@qq.com' //对于person中不包含的属性,不会录入
    },function (error, doc){
        console.log(doc);
    });
```
###### 根据指定条件删除删除记录
```javascript
    var conditions_delete = { name: 'dsm'};
    person.remove(conditions_delete,function(error){
       if(error){
           console.log(error);
       }else {
           console.log('delete success!');
       }
    });
```
###### 更新记录(似乎只更新第一条??)
```javascript
    var conditions_update = { title: 'aaa' };
    var update = {$set :{author: '咻咻咻'}};
    Blog.update(conditions_update,update,function (error,doc) {
        if(error){
            console.log(error);
        }else{
            console.log(doc);
        }
    })
```
###### 单条查询
```javascript
    Blog.findOne({},function (error,data) {
        //没有附加条件就输出所有记录的第一条
        console.log(data);
    })
```  
  
---
## 2016年6月28日

### 新工具理解

1. mongoDB，是应用于web的轻量级数据库。  
2. mongoose，是对mongoDB操作的代码的封装，简化代码，类似于css中的bootstrap。  
3. robomongo，可视化的mongoDB的软件，实时修改数据库。  

### mongoose理解

1. schema：数据库模型骨架
2. model：来源于schema的模型，有属性和函数
3. entity：根据model创建的实例
*Schema生成Model，Model创造Entity*

### mongoDB数据库
1. 在/node_modules中放入mongoose文件夹
2. 引用mongoose模块，创建模型，生成实例，赋值，操作
```javascript
var mongoose = require('mongoose');
var db = mongoose.createConnection('localhost','test');
db.on('error',console.error.bind(console,'连接错误:'));
db.once('open',function(){
    //一次打开记录
    //此处可添加伪造数据，完成数据查询，接下去要把不同功能的代码分装，难点在于路由
    };
router.get('/', function(req, res, next) {
  // res.render('index', { title: 'Express' });

  mongoose.connect('mongodb://127.0.0.1:27017/test');
  //连接到测试数据库
  var Schema = mongoose.Schema;
  //引用mongoose模块的schema骨架
  var blogSchema = new Schema({
    title:  String,
    author: String,
    body:   String
  });
  //创建名为blogSchema的模型，添加title、author、body三个属性
  var Blog = mongoose.model('Blog', blogSchema);
  //创建名为Blog的blogSchema类型的实例
  blog = new Blog({
    title: 'aaa',
    author: 'bbb',
    body:   'ccc'
  })
  //实例变量赋值
  blog.save(function(err, doc) {
    if (err) {
      console.log('error')
    } else {
      console.log(doc)
    }
  })
  //存储至mongoDB

});
```
### 昨日问题整理
图片显示问题：
```javascript
app.use(express.static(path.join(__dirname, 'public')));
```
   路径问题，因为静态映射设置为public文件夹，因此直接设置路径
```html
<img src="/images/rab.jpg">
```
  关于layouts文件夹中的显示布局，引用其他模块，如头文件head。要注意div有无重叠，{{{body}}}指当前页面地址对应的hbs文件中包含的所有内容。
```html
<!DOCTYPE html>
<html lang="zh-cn">
<head>
    {{>head}}
</head>
<body>
    <div class="blog-container container-fluid">
        {{{body}}}
        <!--body包含的内容就是当前页面包含的hbs-->
    </div>
</body>
</html>
```
```javascript
router.get('/blog', function(req, res, next) {
  res.render('blog', { title: 'Express' , layout:'main'} );
<!--此段代码即表示{{{body}}}包含了blog.hbs中的所有模块，在此在注意今后自己规划hbs的分块要明确-->
});
```

---


## 2016年6月27日

### nodejs 文件基本结构

dir/bin  
...www  
/node_modules  
...body-parser  
...cheerio  
...cookie-parser  
...debug  
...express  
...express-handlebars  
...hbs  
...mongoose  
...morgan  
...serve-favicon  
/public  
...images  
...javascripts  
...lib  
...stylesheets  
/routes  
...admin.js  
...index.js  
/views  
...admin  
...layouts  
...partials  
...blog.hbs  
...error.hbs  
...index.hbs  
...layout.hbs  
...login.hbs  
app.js  
package.json  


### 如何配置hbs模板
```javascript
//先引入模块  
var exphbs =require('express-handlebars');  
```

```javascript
//配置hbs基础模板和分块模板  
var hbs = exphbs.create({  
  partialsDir: 'views/partials',  //partials默认路径为views/partials
  layoutsDir: "views/layouts/",   //layout默认路径为views/layouts/
  defaultLayout: 'main',          //默认布局模板为main.hbs
  extname: '.hbs'                 //设置文件后缀名为.hbs
});  

app.engine('hbs', hbs.engine);  
```

### 如何映射静态文件目录  

```javascript

//路由中间件按照顺序匹配，在当前目录下无法匹配时，才进行下一步，默认为public文件夹
//使用static中间件 制定public目录为静态资源目录,其中资源不会经过任何处理
app.use(express.static(path.join(__dirname, 'public')));
app.use('/', routes);
//localhost:3000/ 映射到routes文件夹下
app.use('/admin', admin);
//localhost:3000/admin映射到admin文件夹下
```

###  

### 如何配置路由

```javascript
//获取express模块，并且新建router
var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/blog', function(req, res, next) {
  res.render('blog', { title: 'Express' , layout:'main'} );
});
//localhost:3000/blog，转到blog.hbs，显示布局为main.hbs
router.get('/login', function(req,res,next) {
    res.render('login',{ title: 'Express', layout:'lg'});
});
//localhost:3000/login，转到login.hbs，显示布局改为lg.hbs

module.exports = router; //开放router的对外接口
```
  
***











