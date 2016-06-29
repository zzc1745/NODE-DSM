# 学习日记

***2016年6月27日***  

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


***2016年6月28日***

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

***2016年6月29日***
### json和ajax的回顾
json:封装数据
```javascript
    var jsonStr = "{\"a\":\"内容1\", \"b\":\"内容2\",\"c\":\"内容3\",\"d\":\"内容4\"}";
    //jsonStr是json类型的字符串
    var jsonObj = eval("(" + jsonStr + ")"); 
    //jsonObj是jquery对象
```
ajax:异步调用json数据对象，输出到html

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

3. 伪造数据与增删查改  
###### 通过entity创建记录
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
