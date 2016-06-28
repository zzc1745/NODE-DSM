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













