# 学习日记
## 2016年7月17日
#### async
```js
$ajax{
    async:true; //表示异步更新(默认为true)，如果async为false，则意为锁死浏览器，直到同步完成才能进行下一步，可以避免数据输出空
    //当ajax发送请求后，在等待server端返回的这个过程中，前台会继续 执行ajax块后面的脚本，直到server端返回正确的结果才会去执行success
}
```
#### md添加链接与添加图片
**链接**  
语法符号：[]()（[ ]中放锚文本，()中放链接地址）  
如： `[简书](http://jianshu.com)`  
**图片**  
语法符号：![]()（[ ]中放图片说明，()中放图片链接）  
如：`![图6.图片](http://upload-images.jianshu.io/upload_images/1874563-b575b513f4b98df0.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)`  
仓库中新建图片文件夹，选择raw格式

#### 使用post和get方法向服务器发送数据，请求服务器  
1.使用Get请求时,参数在URL中显示,而使用Post方式,则不会显示出来  
2.使用Get请求发送数据量小,Post请求发送数据量大  
3.get请求在发送后,即被缓存,而post请求时 never cached.  
<!-- ![图2.图片](https://raw.githubusercontent.com/HZNU-QUANTA/NODE-DSM/master/BLOG/public/images/22.jpg) -->
`xmlHttp.send(username = "zhangsan");`
测试代码,结果输出的是"张三"(初始值).  
`xmlHttp.open("post", "Server.aspx?username=zhangsan", true);`
修改成功显示"zhangsan"  
当我们在get和post请求时,同时在url中、send方法的data中都放置了参数,获取的总是url中的参数值。   
因为在使用Request时,其会从QueryString,Form,ServerVariable中遍历一番,如果发现符合要求的数据,那么就会停止向后搜寻.所以,我们上例中获取的username实际上都是**url中的username值.**  
- [Get请求和Post请求的区别](http://www.cnblogs.com/oneword/archive/2011/06/06/2073533.html)




----
## 2016年7月14日
#### 
按照添加时间展示技术新闻：  
News.find().sort("meta.createAt":-1);  //以meta.createAt为用来排序的键，-1表示降序排列  
在blog.hbs中，调用hbsHelper.js中为moment模块声明的外部调用函数需要用到一下路由设置代码：  
```js
*var hbsHelper = require('./lib/hbsHelper');*
var hbs = exphbs.create({
  partialsDir: 'views/partials',
  layoutsDir: "views/layouts/",
  defaultLayout: 'main',
  extname: '.hbs',
  *helpers: hbsHelper*
  //指定handlebar的渲染
});
```

---
## 2016年7月10日
#### mongodb分页模块
1. 传统sql分页  
row_number分页思想：取第(pageIndex*pageSize)到第(pageIndex*pageSize + pageSize)  
时间戳（一个字符序列，唯一地标识某一刻的时间）：Web 页面通过记录的创建时间的有序性质来取数据  
2. mongodb分页：  
参数：  
PageIndex    当前页  
PageSize      每页记录数  
QueryParam[]  其他的查询字段  
```js
db.test.find({xxx...xxx}).sort({"amount":1}).skip(10).limit(10)   
//思想等同于跳过前M*N条记录，取N条记录
//存在的性能问题：不要轻易使用Skip来做查询，否则数据量大了就会导致性能急剧下降，这是因为Skip是一条一条的数过来的，多了自然就慢了。
```


方法一：(数据量小时使用)  
查询第一页的数据：`db.test.find().sort({"age":1}).limit(2);`  
查询第二页的数据：`db.test.find().sort({"age":1}).skip(2).limit(2);`  
方法二：(数据量大时使用，因为skip函数跳过记录消耗很多性能)  
查询第一页的数据：`db.test.find().sort({"age":1}).limit(2);  //记为p1`  
查询第二页的数据：获取第一页最后一条记录的值，然后排除前面的记录，就能获取到新的记录了  
`while(p1.hasNext()) latest=p1.next;`  
`db.test.find({"age:{"$gt:latest.age}}).sort({"age":1}).limit(2);`  

默认检索：`db.SortTest.find()`  
排序索引：`db.SortTest.find().sort({name: -1})` ，则对name字段降序  
同时多个字段的排序索引：`db.SortTest.find().sort( { age: -1 , name: 1} );`   
返回结果集的条数：`db.test.count()`

#### 使用async完成同步 each用法 
```js
var sqls = {
    'insertSQL': 'insert into t_user(name) values("conan"),("fens.me")',
    'selectSQL': 'select * from t_user limit 10',
    'deleteSQL': 'delete from t_user',
    'updateSQL': 'update t_user set name="conan update"  where name="conan"'
};

var tasks = ['deleteSQL', 'insertSQL', 'selectSQL', 'updateSQL', 'selectSQL'];
async.eachSeries(tasks, function (item, callback) {
    console.log(item + " ==> " + sqls[item]);
    conn.query(sqls[item], function (err, res) {
        console.log(res);
        callback(err, res);
    });
}, function (err) {
    console.log("err: " + err);
});
```

---

## 2016年7月8日
#### 破解totalFinder
1. 附件里面的codesign是从10.9.4系统的下复制出来的codesign文件。

2. 从Finder选择菜单，选择到文件夹。在输入框内输入路径：/usr/bin/

3. 将原codesign重命名codesign1095(3，4步需要输入权限密码)

4. 把附件中的codesign复制到/usr/bin/目录下。

    复制中发现复制不进去，改用命令行，但是没有用

   ```
   sudo cp /user/trick/desktop/codesign1095#/usr/bin 
   //复制文件到指定文件夹
   ```

5. 进入`/Library/ScriptingAdditions/TotalFinder.osax/Contents/Resources` 目录，将 TotalFinder.bundle 拖入破解软件窗口；破解完成。


#### MAC在Finder栏显示所浏览文件夹路径的方法

**操作步骤：**

　　打开“终端”（应用程序-》实用工具），输入以下两条命令：

　　``defaults write com.apple.finder _FXShowPosixPathInTitle -bool TRUE;killall Finder``

**如何恢复默认状态呢？**

　　打开“终端”（应用程序-》实用工具），输入以下两条命令：

　　``defaults delete com.apple.finder _FXShowPosixPathInTitle;killall Finder``

#### linux 常用命令行  
参考资料：http://www.oschina.net/translate/useful-linux-commands-for-newbies  


---

## 2016年7月7日
#### mongodb_修改器  
参考资料：http://www.cnblogs.com/xiangxiaodong/archive/2012/12/15/2820051.html  
$inc ：对某个数字类型的键，进行增加操作  
$set ：用来指定一个键并更新键值，若键不存在并创建。内嵌文档的更新，用点连接  
$unset：用来删除某个键。（使用修改器$unset时，不论对目标键使用1、0、-1或者具体的字符串等都是可以删除该目标键。）  
$push：可以push一个当前文档中不存在的键，也可以向文档的某个数组类型的键添加一个数组元素，不过滤重复的数据。  
$ne/$addToSet ：：可以避免重复添加数组元素  
$pop：从数组的头部或尾部删除数组中的元素  
$pull：从数组中删除满足条件的元素  
upsert：如果有符合条件的文档，update；如果没有，insert  
save函数：可以在文档不存在的时候插入，存在的时候更新，只有一个参数文档。  

#### 新闻列表模块编写整理
1. router.post()传入后台  
   router.get()传出到页面前端  
   ```javascript
    router.get('/blog', function (req,res,next) {
        dbHelper.getNews(req, function (success,docs) {
            //回调函数中的docs要和res.render的传出参数docs一致
            res.render('blog', { entries: docs , layout: 'main'});
        });
    });
   ```
2. 在blog.hbs中，因为在注释中出现了{{{}}}的符号，导致了字符串解析失败，页面不能显示，删除该注释之后就可以了  


---
## 2016年7月6日 

#### 正则表达式

1. 字符集合 

   常用元字符表：

   \b表示单词的分解处，匹配的是一个位置

   \d{n}表示连续重复匹配n次

   \d+表示匹配重复1次或更多次

   常用的限定符表：

   *：重复0次或更多次

   +：重复1或更多

   ?：重复0或1次

   {n}：重复n次

   {n,}：重复n或更多次

   {n,m}：重复n~m次

2. 匹配方式

   []：匹配字符  eg. [aeiou]、[a-z] 

   |：分枝条件   \d{5}-\d{4}|\d{5}这个表达式用于匹配美国的邮政编码。美国邮编 的规则是5位数字，或者用连字号间隔的9位数字。之所以要给出这个例子是因为它能说明一个问题：**使用分枝条件时，要注意各个条件的顺序**。 如果你把它改成\d{5}|\d{5}-\d{4}的话，那么就只会匹配5位的邮编(以及9位邮 编的前5位)。原因是匹配分枝条件时，将会从左到右地测试每个条件，如果满足了某个分枝的话，就不会去再管其它的条件了。

3. 反义   

   \w 表示匹配任意不是字母数字下划线汉字的字符

   [^x]匹配除了x以外的任意字符
    ​   ​

---

## 2016年7月5日
## nodejs读书笔记
- 登入与登出，本质上是req.session.user变量标记的变动。signout的实现，就是使用res.redirect('/')重定向跳转到其他页面，并且设置user=null;  
  页面设置访问权限：原理是在每个页面的路由响应函数内，检查是否登录；为简化代码，利用路由中间件，在每个路由前加路由中间件, 可实现页面控制。
```js
app.get('/reg', checkNotLogin);   
app.get('/reg', function(req, res) {});  
app.post('/reg', checkNotLogin);  
app.post('/reg', function(req, res){});
app.get('/logout', checkLogin); 
app.get('/logout', function(req, res) {});
app.get('/login', checkNotLogin); 
app.get('/login', function(req, res) {});
app.post('/login', checkNotLogin);
app.post('/login', function(req, res) {});
function checkLogin(req, res, next) { 
  if (!req.session.user) {
      req.flash('error', '未登入'); 
      return res.redirect('/login'); }
      next(); }
function checkNotLogin(req, res, next) {
      if (req.session.user) {
        req.flash('error', '已登入');
        return res.redirect('/');
      }
next(); }
```
- 为登录用户与未登入用户显示不同信息：  
```
if(success)
<div>正常页面</div>
if(error)
<div>错误页面</div>
```
- js异步调用原理  
  https://segmentfault.com/a/1190000002545312
---
## 2016年7月4日
#### 安装网页调试插件 devtool  
安装：``npm install -g devtool``  
启动一个带有 Node.js 特性支持的 Chrome 开发者工具实例  
相比webstorm自带的debug可以更灵活的设置断点，直接获得变量的当前取值  
调用插件：``devtool app.js``   
*但是竟然安装失败*

#### json数据获取解析
调出新闻记录中的所有纪录，获得的是一个字符串，需要把它转化成一个对象，因为是多条纪录，最终得到对象数组。  
在hbs中通过{{}}调用json数据  
今天外出做志愿者，对于发布新闻模块只形成一个大概的想法：  
1.find()函数查找News中的所有记录并且转为json格式  
————>2.ajax调取在1中获取到的json数据，传入后台  
————>3.路由设置/blog页面，用json数据填充hbs模板  
明天早起完成部分编码工作  

---
## 2016年7月3日
#### nodejs 学习笔记  ——P115
1. Mongodb是一个对象数据库，没有表、行的概念，也没有固定的模式和结构，所有数据以`文档`的形式存储。
2. Cookie，用来存储在客户端的信息，每次连接是，由浏览器向服务器提交，服务器也向浏览器发起存储Cookie的请求。由此实现，用户浏览多个页面，每个页面可以保持联系，不会断档。
3. 函数与数据调用的简单介绍
```
req.body  : post请求信息解析过后的而对象。域值。  
req.flash : 用于保存只出现在用户当前和下一次请求中的变量。随后被清除，便于实现页面通知和错误信息。  
res.redirect : 重新定向，浏览器可以跳转至其他页面  
User.get  : 通过用户名获取已知用户  
User.save : 将对用户对象的修改存入数据库  
req.session.user : 向会话对象写入当前用户的信息  
```

1. chrome断点查询的插件（**明天安装！！**）：https://segmentfault.com/a/1190000004509016  
2. 通过jshint检查代码的潜在bug：

http://www.liaoxuefeng.com/article/0014000752598322598e226abeb4b1dafaf6fba462f3da4000  
Warning: JSLint will hurt your feelings.  

#### 完成注册页面的编写
1. find函数，找不到记录情况下，返回null；  
            找到记录情况下，返回字符串，需要通过data.stringify来转化成json对象  
            函数处理出错时，才会返回error信息  
2. 整理文件结构，有助于编写某个功能的代码  
   通过总结出一个功能的实现，主要分为四个部分：  
   **1. 前端页面**   
   ......*页面展示框架（layouts）+ div的具体布局 + CSS *  
   **2. 后台js**  
   ......*模型文件声明 + 功能函数编写 + 前台/后端数据调用*  
   **3. 路由连接前端与后台**  
   ......*routes文件下的路由*  

---
## 2016年7月2日
#### js代码错误检查插件
1. 安装jshint:  
   `npm install jshint`  
   `npm install jshint --save-dev`  
2. js代码在线纠错  
   http://www.jslint.com/  

#### 资料储备
1. nodejs生成pdf文档  
   PDFKit（http://pdfkit.org/） 最专业的函数库，支持各种pdf文档的数据格式，只是使用起来比较复杂，适合专业开发者。  
   Wkhtmltopdf（https://npmjs.org/package/wkhtmltopdf） 将HTML转化成pdf文档的引擎，使用起来非常方便简单  
   PhantomJS（http://www.feedhenry.com/server-side-pdf-generation-node-js/） PhantomJS 是一个基于 WebKit 的服务器端 JavaScript API。它全面支持web而不需浏览器支持，其快速，原生支持各种Web标准： DOM 处理, CSS 选择器, JSON, Canvas, 和 SVG。 PhantomJS 可以用于 页面自动化 ， 网络监测 ， 网页截屏 ，以及 无界面测试 等。
   <br/>
   <br/>
2. 使用 Sublime + PlantUML 画出图示  
   http://www.jianshu.com/p/e92a52770832  

3. 设置全局变量  
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

#### 
---
## 2016年7月1日

#### 自动添加依赖项到package.json
`spm install module-name -save` 自动把模块和版本号添加到dependencies部分  
`spm install module-name -save-dve` 自动把模块和版本号添加到devdependencies部分  
产品模式用dependencies，开发模式用devDep。  

#### ajax函数的调用相关
参考资料：https://segmentfault.com/a/1190000002405469  


#### chrome 调试断点技巧：
- `{ }`可以把压缩代码优化成可读性强的代码  
- `resume script execution` 恢复执行脚本  
- 打开js代码，设置/取消断点，右侧“breakpoints列表可以查看断点  
- 箭头加斜杠标识，表示临时禁用所有断点 
- call stack（调用栈），可以查看当前断点所处的方法调用栈，可以嵌套调用，也就是说可以含有断点的最外层函数也会被包含进来调用栈中的每一层叫做一个frame，点击每个frame可以跳到该frame的调用点上。  
- scope中查看变量具体的参数

####  node常用模块简介
参考资料：http://www.open-open.com/lib/view/open1409796214932.html  

####  增加新闻模块的debug心得
1. 出现数据库连接错误提示：trying to open unclosed database  
   原因：同一个数据库，不能打开两次
   >相关技术：如何同时连接多个数据库  
   >`mongoose.connect()`只能连接一个数据库  
   >`mongoose.createConnection()`可以同时连接多个数据库  
   >参考资料：http://jayceefun.github.io/blog/2013/08/27/mongoose_multi_dbs/  

2. ajax无法从前台获得数据，传入后台  
   解决：明早具体补充  
   明早看关于全局变量的内容：http://www.hacksparrow.com/global-variables-in-node-js.html  


#### 为加强理解，对nodejs项目框架分析

>bin  
>......www : 创建web服务器，配置监听port  
>db  
>......schema  
>............news.js:新闻模型保存+记录保存预处理+将该模型输出到数据库的一张表中  
>......user.js : 用户模型保存+记录保存预处理+将该模型输出到数据库的一张表中  
>......db.js : 向控制台输出数据库的连接状态status  
>......dbHelper.js : 获取`./schema`中的模型，findUsr函数（findOne匹配，输出结果到entries）和addNews函数（获取传入数据并转化到News模型数据+保存函数**不懂这个model.pre('save')函数的调用机制**）  
>......jsonRes.js  
>lib  
>......hbsHelper.js : 获取moment模块，存储日期处理函数，并输出到外部供调用  
>......webHelper.js : 获取remarkable模块，存储函数并输出到外部供调用（目测该模块的用处是高亮网页的error信息）  
>node_modules:存放封装好的模块  
>public  
>......blog  
>............addNews.js : 增加新闻的ajax函数调用，验证登录信息并完成跳转  
>............login.js : 登录页面的ajax函数调用，调用发布提示  
>......img : 存放图片  
>......lib :  存档模板代码框架  
>......stylesheets : 存放css  
>route  
>......admin.js : 存放/admin路径下的路由，有页面展示和数据调用函数  
>......index.js : 根路径下的分支路由  
>views  
>......admin  
>............news.hbs : 新增新闻页面的`改动部分`  
>......error : 错误提示  
>......layouts : 展示层的框架们  
>......partials : 包含了`所有`页面内`不发生改动的部分`  
>.......gitgnore   
>......app.js : 项目的入口文件，配置模块引擎和默认静态资源映射  
>......config.js : 配置站点信息，和数据库连接信息  
>......package.json : 外部依赖项的路径  
```
update(2016.7.2):  
model.pre('save')函数的理解  
在/routes/admin.js路由文件中,调用addNews函数，可以把获取到的前台的数据存为news实例，成为一条可以被加进News表中的一条记录，并且通过addNew（）函数中包含的news.save函数，自动保存到表中。  

```
---

## 2016年6月30日    
#### 登录模块调试总结
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

#### *node.js学习指南*PDF第五章（1-6节）学习总结  

###### app.js文件  
1. ```app.configure(function(){});```
   通过回调函数，设置app对应的Express模块的参数
2. ```app.set();```   设置参数  
   ```app.use();```   启用中间件  
3. 心得体会：这几天学的内容繁多，对于新软件的使用也很不上手，很难理解页面的实现，之前主要靠重复调试得到想要的效果，对于原理仍然一知半解。今天在阅读书本之后，真正理解“app.js是入口文件”，整个项目文件，从app.js开始解析，首先获取模块，然后设置路由，接着在不同页面的跳转中，触发新的js文件，执行对应的函数，在控制台输出数据。项目从零碎的部件，得到线索能够串起来，对于理解上，有一个比较大的进步。
###### 路由文件
```js
exports.index=function(req,res){
    res.render('index',{title:'Express'});
    //定义一个函数，调用'index.hbs’模板解析引擎，产生页面返回浏览器
    //{title:'Express'}是传入的参数
};
```
######Express处理路由规则
1. 同一个路径(如'/login')可以绑定多个路由响应函数，但是按照顺序优先匹配第一个。
2. next()的用处，转移控制权，就是用于服务上述情况，从当前匹配的函数，跳转至下一个匹配路径的规则。
3. next()，也可以起到类似中间件的效果，提取相似请求的相同部分，结合页面模板和要显示的数据结合生成HTML。  
   eg.验证用户名存在与否；存在则展出，不存在则输出error。验证部分就可以插入next()

#### TotalFinder插件
###### 安装习得  
马克资源：mac优化工作环境必备一级棒 http://ju.outofmemory.cn/entry/217935 
​
###### 破解totalFinder：
1. 某个教程知道把/Library/ScriptingAdditions/TotalFinder.osax/Contents/Resources路径下的TotaFinder.bundle放入patch.app即可  
   因下载版本无patch.app文件更换破解方法
2. 重新下载文件，遇到文件损坏问题，打算等到过期再破....

###### 
连续两次遇到zip文件解压生成cpgz文件，cpgz解压后又生成zip文件
> 导致这种情况的原因有一下几点：  
   1. zip文件已经损坏；  
   2. zip文件下载时没有下载完全；  
      1. 浏览器在下载或者下载完成zip文件时，对其进行了错误处理；  
      2. bug导致。  

首先验证一下你的zip文件md5 hash或者SHA1，如果校验显示不同，说明你的文件有损坏或者下载不完全。
> Tips：  
> 校验MD5 hash方法：打开终端，输入MD5，空格，然后输入需要验证的文件路径（可以直接将文件拖进去）  
> 校验sha1：打开终端，输入shasum，空格， 然后输入需要验证的文件路径（可以直接将文件拖进去）

验证结果：两个校验码不同，文件损坏  

###### 电脑重启，忘记启动mongodb导致无法连上数据库  
在mongodb根目录下配置路径为db   
2016年7月4日，第二次连接数据库，采用同样方法失败，改用**绝对路径**成功
mongod --dbpath /usr/local/Cellar/mongodb/3.2.7/data/db  

---

## 2016年6月29日

#### json和ajax的回顾
json:封装数据
```javascript
    var jsonStr = "{\"a\":\"内容1\", \"b\":\"内容2\",\"c\":\"内容3\",\"d\":\"内容4\"}";
    //jsonStr是json类型的字符串
    var jsonObj = eval("(" + jsonStr + ")"); 
    //jsonObj是jquery对象
```
ajax:异步调用json数据对象，输出到html  
参考：http://www.php100.com/html/program/jquery/2013/0905/5912.html  

#### 数据库交互的理解（登陆部分）
步骤：  
1. 定义数据模型，userSchema  
2. 声明模型可以使用的函数findUsr()与addUser()，并开放接口  
3. 在index.js中添加用户模块的路由  



#### 问题整理
1. mongoose模块已经通过命令行install但无法require  
   解决：  
   确认已经在node_modules文件夹中添加模块文件  
   在package.json文件中，还要再添加dev外部依赖项  

2. http之间的状态码  

| Type | Reason-phrase | Note                   |
| ---- | :-----------: | :--------------------- |
| 1XX  | Informational | 信息性状态码，表示接受的请求正在处理     |
| 2XX  |    Success    | 成功状态码，表示请求正常处理完毕       |
| 3XX  |  Redirection  | 重定向状态码，表示需要客户端需要进行附加操作 |
| 4XX  | Client Error  | 客户端错误状态码，表示服务器无法处理请求   |
| 5XX  | Server Error  | 服务器错误状态码，表示服务器处理请求出错   |

3.伪造数据与增删查改  

#########通过entity创建记录
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
######### 查询该实例前身的所有记录
```javascript
    Blog.find(function (err,blogs) {
        console.log(blogs);
    })
    person.find(function(err,persons){
        console.log(persons)
    });
```
######### 通过model调用create创建记录
```javascript
person.create({
        name: 'xxxjjj',
        password:'jkfdksajflkdsaf',//没有录入已有属性,则不输出
        email: '864741099@qq.com' //对于person中不包含的属性,不会录入
    },function (error, doc){
        console.log(doc);
    });
```
######### 根据指定条件删除删除记录
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
######### 更新记录(似乎只更新第一条??)
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
######### 单条查询
```javascript
    Blog.findOne({},function (error,data) {
        //没有附加条件就输出所有记录的第一条
        console.log(data);
    })
```

---
## 2016年6月28日

#### 新工具理解

1. mongoDB，是应用于web的轻量级数据库。  
2. mongoose，是对mongoDB操作的代码的封装，简化代码，类似于css中的bootstrap。  
3. robomongo，可视化的mongoDB的软件，实时修改数据库。  

#### mongoose理解

1. schema：数据库模型骨架
2. model：来源于schema的模型，有属性和函数
3. entity：根据model创建的实例
   *Schema生成Model，Model创造Entity*

#### mongoDB数据库
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
#### 昨日问题整理
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

#### nodejs 文件基本结构

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


#### 如何配置hbs模板
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

#### 如何映射静态文件目录  

```javascript

//路由中间件按照顺序匹配，在当前目录下无法匹配时，才进行下一步，默认为public文件夹
//使用static中间件 制定public目录为静态资源目录,其中资源不会经过任何处理
app.use(express.static(path.join(__dirname, 'public')));
app.use('/', routes);
//localhost:3000/ 映射到routes文件夹下
app.use('/admin', admin);
//localhost:3000/admin映射到admin文件夹下
```

####  

#### 如何配置路由

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











