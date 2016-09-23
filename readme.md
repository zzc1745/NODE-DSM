# 学习日记
## 2016年9月11日
#### 文章查询 
###### 模块思路
1. form表单action=''、method='get'方式获取搜索框内的关键字，并使用RegExp，来构建正则表达式对象，生成模糊字  
2. 调用查找文章函数，以正则表达式对象为查找关键字，原理同blogs页面，并把data传输到前台  



## 2016年9月10日
#### 添加留言
##### 模块思路
1. 再打开该条博客时，将博客_id存储到全局变量config.news.path  
2. 点击发表评论，抓取前台页面信息储存  
3. 以post方式处理页面路由时，调用添加评论函数，并把该博客_id通过全局变量的媒介存储到数据库中  
4. 以get方式处理页面路由时，调用查找评论函数，以博客_id作为查找关键字，以each的方式传输到前台  


##### 获取前台变量规则
参数在url中时  
/path/:id,参数在req.params.id中  
/path?id=xx,参数在req.query.id中  
用json body或者form表单传参时参数在req.body中  

##### 问题与解决
遇到的问题：  
在router.post('/blogPDF/:id')页面，不能用req.params.id获取到id值  
解决的方法：  
把正确的id值预先存到一个全局变量中去  
遇到的问题：  
同一个路由下，不能连续使用两次res.render();  
解决的方法：
把第二个把res.render作为回调函数的原函数，写入“第一个需要res.render作为回调函数的原函数”的回调函数里。  




## 2016年9月8日
## 网页访问量统计
备用途径：  
1. 借助数据库：每次测试提交一条记录，测试人数就是读取记录数来显示，涉及到插入和读取操作。  
2. 适用第三方的统计js版代码 比如 百度统计、谷歌统计模块universal-analytics  

具体实现步骤：  
1. 新建一个用于存储游客记录的Schema，在"/login"执行完毕findUser()函数并且成功之后，添加当前用户信息作为一条新纪录插入Visitor数据库。  
2. 路由设置，在"/count"页面设置路由，在该页面下执行Visitor表的数据条数统计，并且输出到页面  
3. 在前台页面获取访客记录数据。   

遇到的问题：  
1. 使用变量不熟练  
2. 添加记录时，总会添加两条，不明白其中原因  
3. 暂且用除二方法获取真实数据  

## 2016年9月6日
#### gulp的使用  
方法，在edit config————>default————>gulp.js添加管理js文件  

#### 消除webstorm的错误warn
1. Open up settings (Ctrl + Alt + S on Linux)
2. Navigate to Languages & Frameworks -> Javascript -> Libraries
3. Click Download and choose jQuery

#### pdf导出问题
只能导出整个页面，不能单独导出博客

## 2016年9月4日
#### npm安装新的package失败
出现的错误：  
```
addlocal could not install //[路径名称]  
Darwin 15.6.0
npm ERR! argv "/usr/local/bin/node" "/usr/local/bin/npm" "install" "formidable" "--save-dev"
npm ERR! node v4.4.6
npm ERR! npm  v2.15.5
npm ERR! code EPEERINVALID

npm ERR! peerinvalid The package eslint@1.10.3 does not satisfy its siblings' peerDependencies requirements!

npm ERR! Please include the following file with any support request:
npm ERR!     /Users/trick/Documents/web/BLOG/npm-debug.log
```
可能的错误原因：  
1. node_modules空间不足  
2. 添加了某一个库，导致其余不同的库对于该库的依赖版本不同  


尝试解决方法：  
1. npm cache clear   解决了addlocal的错误  

2. 手动卸载了再重装了npm  
经过实践，发现重装npm步骤失败，重新更新了brew并重装了nodejs，使自动下载npm包管理器
>
1、sudo npm uninstall npm -g  
如果步骤1卸不掉npm了（我就是这种情况）  
2、进到npm的安装目录 /usr/local/lib/node_modules/npm/  
sudo make uninstall  
3、手动重装npm  
curl -L https://npmjs.com/install.sh | sh   

**最终结果：npm版本太老，升级后即可**


#### nodejs中npm常用命令
npm install <name>安装nodejs的依赖包
npm install <name> -g  将包安装到全局环境中
npm install <name> --save  安装的同时，将信息写入package.json中
npm remove <name>移除
npm update <name>更新
npm ls 列出当前安装的了所有包
npm root 查看当前包的安装路径
npm root -g  查看全局的包的安装路径
npm help  帮助，如果要单独查看install命令的帮助，可以使用的npm help install



## 2016年8月26日
#### 把博客转换成pdf
步骤一：写出静态页面(readmore页面，添加导出pdf页面)  
步骤二：使用phantomjs插件（需要翻墙）  


#### 路由匹配
'/:id':传入各种各样数据类型的id值  
'/:id?':传入各种各样数据类型的id值，也可以设置为空  
'/:id/:operation?':传入一种操作，也可以设置为空  
[路由例子，以及与之相匹配的关联路径](http://www.cnblogs.com/coding4/p/5580498.html)  


## 2016年8月25日
#### git-push失败
出现的错误：
```
error: RPC failed; curl 56 SSLRead() return error -36
fatal: The remote end hung up unexpectedly
fatal: The remote end hung up unexpectedly
```
错误原因：  
It seems like the commit size was too big (default is < 1Mbyte). Resolved it with rising the limit up to 500Mbytes:即上传的文件过大,需要提高上传文件阈值  
`git config --global http.postBuffer 524288000`  

#### jQuery属性选择器
$("[href]") 选取所有带有 href 属性的元素。  
$("[href='#']") 选取所有带有 href 值等于 "#" 的元素。  
$("[href!='#']") 选取所有带有 href 值不等于 "#" 的元素。  
$("[href$='.jpg']") 选取所有 href 值以 ".jpg" 结尾的元素。  

[bootstrap的js插件文档](http://v3.bootcss.com/javascript/#modals)  
[sco.js bootstrap中javascript组件的增强版](http://www.bootcss.com/p/sco.js/)  

#### 文章删除模块
1. 思路分析：hbs写出静态页面————>删除按钮绑定提示框执行选项(yes/no)对应函数————>触发删除数据库记录的函数
2. 实践步骤一：写静态页面，与新闻展示页面类似，提取数据并（{{#each entries}}）循环  
3. 实践步骤二：删除按钮绑定  
用属性选择器，绑定不同选项的触发函数，在这个项目中，通过跳转到可以触发DeleteNews()函数的页面实现。  

#### 文章图片路径错误
`app.use(express.static(__dirname + '/public'))`是将所有请求，先交给`express.static(__dirname + '/public')`来处理一下，通过多次使用 express.static 中间件来添加多个静态资源目录,Express将会按照你设置静态资源目录的顺序来查找静态资源文件。  
对于upload文件夹的路径引用错误，在app.js中缺少以下：  
`app.use(express.static(path.join(__dirname, '/')));`   //静态文件目录设置为项目根目录+/     


## 2016年8月24日
#### 上传文件模块思路
先添加上传文件的控件，把文件保存到指定文件夹，把文件的url以md文件的语法保存到前台并插入到textarea。  
使用middleware完成md语法转换，(remarkable+highligh.js)/markdown
####  jquery的扩展 
声明：通过`$.fn.extend`扩展Jquery函数(在这个项目中表现为common.js文件中的函数扩展，利用脚本引用调用)  
调用：`$.format();`   
#### Node.js的Formidable模块的使用
```
1)     创建Formidable.IncomingForm对象

　　　var form = new formidable.IncomingForm()

2)     form.encoding = 'utf-8' 设置表单域的编码

3)     form.uploadDir = "/my/dir"; 设置上传文件存放的文件夹，默认为系统的临时文件夹，可以使用fs.rename()来改变上传文件的存放位置和文件名

4)     form.keepExtensions = false; 设置该属性为true可以使得上传的文件保持原来的文件的扩展名。

5)     form.type 只读，根据请求的类型，取值'multipart' or 'urlencoded'

6)     form.maxFieldsSize = 2 * 1024 * 1024; 限制所有存储表单字段域的大小（除去file字段），如果超出，则会触发error事件，默认为2M

7)     form.maxFields = 1000 设置可以转换多少查询字符串，默认为1000

8)     form.hash = false; 设置上传文件的检验码，可以有两个取值'sha1' or 'md5'.

9)     form.multiples = false; 开启该功能，当调用form.parse()方法时，回调函数的files参数将会是一个file数组，数组每一个成员是一个File对象，此功能需要 html5中multiple特性支持。

10)   form.bytesReceived 返回服务器已经接收到当前表单数据多少字节

11)   form.bytesExpected 返回将要接收到当前表单所有数据的大小

12)   form.parse(request, [callback]) 该方法会转换请求中所包含的表单数据，callback会包含所有字段域和文件信息，如：

　　  form.parse(req, function(err, fields, files) {

 　　　　 // ...   

　　  });

13)    form.onPart(part); 你可以重载处理multipart流的方法，这样做的话会禁止field和file事件的发生，你将不得不自己处理这些事情，如：

　　   form.onPart = function(part) {

  　　 　　part.addListener('data', function() {

    　　           // ...

  　　　　 });

　　　}

　　  如果你只想让formdable处理一部分事情，你可以这样做:

　　  form.onPart = function(part) {

  　　　　if (!part.filename) {

    　　　　   // 让formidable处理所有非文件部分

   　　    　　form.handlePart(part);

　　 　　 }

　　 }

14)   formidable.File对象

　　A.      file.size = 0 上传文件的大小，如果文件正在上传，表示已上传部分的大小

　　B.      file.path = null 上传文件的路径。如果不想让formidable产生一个临时文件夹，可以在fileBegain事件中修改路径

　　C.      file.name = null 上传文件的名字

　　D.     file.type = null 上传文件的mime类型

　　E.      file.lastModifiedDate = null 时间对象，上传文件最近一次被修改的时间

　　F.      file.hash = null 返回文件的hash值

　　G.     可以使用JSON.stringify(file.toJSON())来格式化输出文件的信息

15)   form.on('progress', function(bytesReceived, bytesExpected) {}); 当有数据块被处理之后会触发该事件，对于创建进度条非常有用。

16)   form.on('field', function(name, value) {}); 每当一个字段/值对已经收到时会触发该事件

17)   form.on('fileBegin', function(name, file) {});  在post流中检测到任意一个新的文件便会触发该事件

18)   form.on('file', function(name, file) {}); 每当有一对字段/文件已经接收到，便会触发该事件

19)   form.on('error', function(err) {}); 当上传流中出现错误便会触发该事件，当出现错误时，若想要继续触发request的data事件，则必须手动调用request.resume()方法

20)   form.on('aborted', function() {}); 当用户中止请求时会触发该事件，socket中的timeout和close事件也会触发该事件，当该事件触发之后，error事件也会触发

21） form.on('end', function() {}); 当所有的请求已经接收到，并且所有的文件都已上传到服务器中，该事件会触发。此时可以发送请求到客户端。
```
#### 图片上传的后台处理
老师给的范文，一次只能上传一张图片，如果重复添加，只能出现最先添加的一张  
优化：
[node.js实现多图片上传](http://www.jb51.net/article/50595.htm)

#### md文字的转换
方法一：  
使用Remarkable，为了能够支持代码高亮，我们还用到了另外一个中间件highlight  
`var md = webHelper.Remarkable();  
 data.content = md.render(data.content);`  
方法二：  
使用markdown插件  
`var markdown = require('markdown').markdown;  
data.content = markdown.toHTML(data.content);`  

[有趣的中间件](http://www.jianshu.com/p/2a533f47a6d7)




## 2016年8月23日
#### formdata对象
`var form = new Formdata();`  
提交（使用submit button）时，会把form中的所有表格元素的name与value组成一个queryString，提交到后台。  
三种方案来获取或修改FormData:  
1. 创建一个空的FormData对象，然后再用append方法逐个添加键值对：  
`var formdata = new FormData();  
formdata.append("name", "司徒正美");`  
2. 取得form元素对象，将它作为参数传入FormData对象中  
`var formobj =  document.getElementById("form");  
var formdata = new FormData(formobj);`  
3. 利用form元素对象的getFormData方法生成它  
`var formobj =  document.getElementById("form");  
var formdata = formobj.getFormData()`  


## 2016年8月16日 
[bootstrap预定义样式](http://v3.bootcss.com/css)  
#### Socket.IO
Socket.IO是一个开源的WebSocket库，它通过Node.js实现WebSocket服务端，同时也提供客户端JS库。Socket.IO支持以事件为基础的实时双向通讯。  
Socket.IO支持4种协议：WebSocket、htmlfile、xhr-polling、jsonp-polling，它会自动根据浏览器选择适合的通讯方式，从而让开发者可以聚焦到功能的实现而不是平台的兼容性。
#### 定点插入图片：
document.selection 表示当前网页中的选中内容。   
方法有：  

-   clear　清除选中的内容
-   empty　取消选中
- createRange　返回 TextRange 或 ControlRange 对象 
- createRangeCollection 不支持   

document.selection.createRange() 根据当前文字选择返回 TextRange 对象，或根据控件选择返回ControlRange 对象。  
NaN = not a number   
[jQuery Validate验证框架详解(表单输入规范)](http://www.cnblogs.com/linjiqin/p/3431835.html)
validate的功能：  
1. 验证用户填写的表单信息是否符合要求
2. 把杂乱数据转换成标准格式

ID选择器返回的jquery对象是一个数组。eg：var file = $("#uploadFile")[0].files[0];  
jquery选择器返回的结果都是伪数组。另外只要一个对象有length跟splice这2个属性就是伪数组

## 2016年8月10日
#### node与express读书（二）
**chap 7 hbs模板引擎**   
模板作用：在同个文件中融合两种编程语言    
##### 层级与上下文
在 Handlebars 中,**所有的块都会改变上下文**  
if单独使用，在 if 或 else 块中,上下文与上一级上下文是相同的，使用../.访问上级上下文。但是在each嵌套中使用if，得使用 ../../.。  
在{{#each currencies}}块中使用{{.}}。{{.}}指向 当前上下文。  
##### 布局与视图
布局：一种特殊的视图，用于模板的模板。  
视图：通常表现为网站上的各个页面(它也可以表现为页面中 AJAX 局部加载的内容,或一封电子邮件,或页面上的任何东西)。默认情况下,Express 会在 views 子目录中查找视图。  
渲染顺序：渲染视图 ——> 渲染布局  
##### 局部(partial)与段落(section)
使用局部文件(partial)，使有些组成部分(在前端界通常称为“组件”)需要在不同的页面重复使用
{{> partial_name}}可以让你在视图中包含一个局部文件  
使用段落(section)，使你的视图本身可以添加到布局的不同部分  

**chap8 表单**  
`<input>` 标签的 name 属性:属性用于对提交到服务器后的表单数据进行标识，或者在客户端通过 JavaScript 引用表单数据。  
注释：只有设置了 name 属性的表单元素才能在提交表单时传递它们的值。  
$(this).attr(key); 获取节点属性名的值，$(this).attr(key, value); 设置节点属性的值  
closest() 方法返回被选元素的第一个祖先元素。

提交表单————>处理表单————>url跳转————>跳转到重定向目标
post———————>在同一url处理表单————>303重定向————>跳转
get————————>独立路径url处理————>303重定向————>跳转
`res.render(303,'/url');  /301也可重定向，但二次跳转回跳过验证过程`  
重定向目标：  
1. 某专用页面，工作量大
2. 原来的url，需要用某隐藏域暂存url
3. 预测新的url
处理数据：建议用post方式，使用express处理，使用中间件body-parser解析url，激活req.body。  
调动方式：req.body._name 即为name属性为_name的input标签的节点内容  
上传文件：使用formidable中间件，form标签中必须指定 enctype="multipart/form-data" 来启用文件上传。  
安装Formidable(npm install --save formidable)并创建一下路由处理程序  
可拖拽,可以看到上传文件缩略图,并查 看进度条：使用jQuery File Upload(http://blueimp.github.io/ jQuery-File-Upload)。  
要显示文件缩略图,jquery-file-upload-middleware使用ImageMagick，在OSX中,你可 以使用 brew install imagemagick 来安装。  

## 2016年8月5日
#### phantomjs模块安装问题
在试用老师模板的时候，打开pfd转换功能，失败。  
发现时phantomjs未安装的原因，用国内网安装失败多次，试用淘宝镜像也失败，改用vpn，下载成功，pdf导出功能实现。

## 2016年8月4日
#### 权限限制模块
需要工具：cookie-parser、express-session  
思路：  
1. 编写载入网页权限的中间件 authority.js，检查有无登陆记录即req.session.user中有无值，如果有值，进入博客主页；如果是字符串**'undefined'**，就重定向进入login界面  
2. 在app.js中添加路由规则  
登陆界面的路由不需要验证,所有人都可以查看  
博客页面的路由，需要先检查权限(authority.isAuthenticated)，才能进入指定的路由文件寻找路由  
3. 修改相关的跳转路径；在完成登陆后页面跳转前，将数据保存进req.session.user属性

#### mongodb的开启与关闭
默认接口27017  
开启：mongod --dbpath /usr/local/Cellar/mongodb/3.2.7/data/db    
关闭：  
1. 登录数据库
[mongo@redhatB data]$ mongo
MongoDB shell version: 2.2.1
connecting to: test    
2. 关闭 MongoDB 服务
 > use admin;
switched to db admin
> db.shutdownServer();   
参考文献：[MongoDB：关闭服务](http://blog.sina.com.cn/s/blog_a51dfb960101jynj.html)  
#### NPM设置淘宝镜像提高扩展安装速度
### 单独使用方法 
npm install -g xxxxxx --registry=https://registry.npm.taobao.org 
### 设置全局配置 
1. 打开.npmrc文件（在用户主目录下，没有的话可以建一个: touch ~/.npmrc） 
2. 加入以下配置信息： 
registry = http://registry.npm.taobao.org

---
## 2016年8月3日
#### 发现好用插件
[屏蔽广告插件  adblock plus](https://downloads.adblockplus.org/devbuilds/adblockpluschrome/)

#### 使用session实现授权认证模块
笔记待整理
[session详解](http://www.cnblogs.com/chenchenluo/p/4197181.html)
[路由与中间件再回顾](http://www.cnblogs.com/chenchenluo/p/4192282.html)
---
## 2016年8月2日
#### 埋一个坑 
利用jquery pagination分页  
[jquery pagination](http://www.zhangxinxu.com/jq/pagination_zh/)  
利用bootstrap paginator分页  
[bootstrap paginator](http://www.jb51.net/article/85368.html)  
[bootstrap paginator](http://jingpin.jikexueyuan.com/article/29434.html)

先套用老师模板试试，使用url获取变量
疑问：href="{{#le pageNumber 1}}?{{else}}?page2={{reduce pageNumber 1}}{{/le}}" aria-label="Previous"
这里的大括弧的对应？  #存在的不同

[angularJS](http://www.runoob.com/angularjs/angularjs-tutorial.html)
## 2016年7月30日 
#### gulp安装
1. 先调用npm全局安装
2. 再在项目中本地安装  
需要安装两次的原因：不污染项目环境，并且在更新模块的时候不容易出错（由于不同版本的gulp导致的错误）  
`tip：查看某个应用程序的安装路径，以node为例，在terminal输入which node即可返回路径。`  

#### gulp使用
1. 在项目根目录下生成gulpfile.js
2. 在gulpfile.js文件中创建task列表
3. 在命令行输入 gulp [task_name]即可启动更新

#### gulpfile.js编写
http://www.gulpjs.com.cn/docs/recipes/ 
----
## 2016年7月29日
#### npm全局安装模块(mac端)
问题:  
`Error: EACCES: permission denied, mkdir '/usr/local/lib/node_modules/gulp'`  
解决方法:  
1. 设置 NODE_PATH变量：`export NODE_PATH=/usr/local/lib/node_modules`  
2. 使用sudo解决npm中由于权限产生的的EACCES错误  
具体步骤:  
>npm config get prefix  //查看当前全局路径  
vi ~/.bash_profile    //进入vi编辑模式添加下行环境配置  
export NODE_PATH=/usr/local/lib/node_modules  
source ~/.bash_profile  //使.bash_profile生效  

#### 几个常见的“npm ERR! Error”
1.**`npm ERR! Error: ENOENT, lstat`**  
解决办法：
```
npm config set user 0 
npm config set unsafe-perm true
```
2.**`npm ERR! Error: No compatible version found `**  
解决办法：升级node版本再来一次  
```
npm install -g n
n stable
```
3.**`npm ERR! Error: EACCES, mkdir`**  
解决办法：权限问题，加个sudo再来一次
```
sudo npm install -g module_name
```
 
#### vi编辑器基本命令
1. vi的启动与退出  
vi:进入vi临时缓冲区  
vi file1:如果file1文件不存在，将建立此文件；如该文件存在，则将其拷贝到一个临时缓冲区。光标定位在该缓冲区第1行第1列的位置上。  ins
:wq:将编辑缓冲区的内容写入文件保存，并退出  
:q!(或:quit)：强制退出vi，不保存  
2. 切换模式  
esc：从输入模式切换到命令模式  
A/a/I/i/O/o:从命令模式切换到输入模式  
2. 在文件中移动光标　　  
h：向左移动一个字符　　  
l：向右移动一个字符　　  
j：向下移动一行　　  
k：向上移动一行　　  
^（即Shift+6）：移动到当前行的开头处　　  
$（即Shift+4）：移动到当前行的结尾处　　  
H（大写）:使光标移动到屏幕的顶部　　  
M（大写）:使光标移动到屏幕的中间　　  
L（大写）:使光标移动到屏幕的底部　　  
Ctrl+b：上滚一屏。　　  
Ctrl+f：下滚一屏。　　  
Ctrl+d：下滚半屏。　　  
Ctrl+u: 上滚半屏。
2. 插入文本  
（1）添加：  
●输入a后，在光标的右边插入文本　　  
●输入A，在一行的结尾处添加文本　　  
（2）插入：　　  
●通过在命令模式下输入i，在光标的左边插入文本　  
●通过在命令模式下输入I，在行首插入文本　  
（3）插入新行：　  
●输入o，在当前光标位置下面打开一行　　  
●输入O，在当前光标位置上面打开一行  

#### 解决sublime安装插件失败问题
错误提示：  
`sublime package control 出现There are no packages available for installation`
错误原因:Sublime Text/preferences/package settings/package Control/setting default文件中，
```
"channels": [
       * "http://127.0.0.1:8080/Documents/channel_v3.json"* //无法获取该网址内容
    ]
```
解决方法：自行下载channel_v3.json文件，并修改setting default中的channels路径  

---

## 2016年7月28日
#### Node.js express获取参数的三种方法
>
- `Checks route params (req.params), ex: /user/:id`  
- `Checks query string params (req.query), ex: ?id=12`  
- `Checks urlencoded body params (req.body), ex: id=`  

1、例如：127.0.0.1:3000/index，这种情况下，我们为了得到index，我们可以通过使用req.params得到，通过这种方法我们就可以很好的处理Node中的路由处理问题，同时利用这点可以非常方便的实现MVC模式；  
2、例如：127.0.0.1:3000/index?id=12，这种情况下，这种方式是获取客户端get方式传递过来的值，通过使用req.query.id就可以获得，类似于PHP的get方法；  
3、例如：127.0.0.1：300/index，然后post了一个id=2的值，这种方式是获取客户端post过来的数据，可以通过req.body.id获取，类似于PHP的post方法；  


#### git仓库管理
1. 新建远程仓库，新建本地仓库。
2. 利用https关联
3. 在关联时，出现错误fatal:remote origin already exits   
在push时，出现错误:Permission denied publickey . fatal Could not read from remote repository.  
*解决方法：  
先删除远程仓库 git remote rm origin   
再添加远程仓库 git remote add origin https:……………………  
*

#### handlebars模板引擎语法归纳  
**行级表达式**  
{{表达式}}，两个大括弧：返回一个html编码的HTML-escape过的值  
{{{表达式}}}，三个大括弧：可以防止某些html字符被转义，如“/”、“:”等特殊字符，并非指标签  
handlebars.SafeString()：返回不会被转移的字符串  
**块级表达式**  
块级表达式Helpers：调用模板，并且可以使用不同的上下文  
1. 上下文：option参数的fn属性，调用上下文  
2. 路径  
①嵌套路径：在当前上下文（当前的json数据）中寻找嵌套属性  
②“../”定位到父级上下文中，在父级模板作用域中寻找属性  
{{./name}}、{{this/name}}、{{this.name}} 三者相同  
3. 注释  
  {{!注释内容}} 或者 {{!--注释内容--}}  
4. 辅助方法  
利用helpers（在这次的项目中，即为hbsHelper.  js文件中的函数）接受处理会计元素当前此刻的上下文（类似于数组中的某一组）  
内建helpers：  
①with：切换上下文，其辱到某个{{}}中去（利用路径）  
②each：循环输出上下文中的内容，用this指代单条内容，在上下文为空时激活else条件  
```
  {{#each}}
  {{@index}} 生成当前循环索引值
  {{@key}} 对object类型的循环
  {{/each}}
```
③if：条件，条件判断返回值为false、undefined、null、“”、[]或0则不渲染  
④unless：if的反向  
⑤log：输出  
---
## 2016年7月23日
#### 编写分页查询
1. 以登陆模块为基础，理清函数调用顺序与调用原理。  
输入登录名与登录密码后，点击登陆button，触发ajax，通过post的方式获取到表单数据  
——>然后调用findUsr函数，获得一个entries实例  
——>将entries实例回调传入登陆模块ajax中的success函数  
```js
$("body").on('click', '#loginBtn', doLogin);
router.post('/login', function(req, res, next) {
  dbHelper.findUsr(req.body, function (success, doc) {
    res.send(doc);
  })
});
```
2. 分页模块同理思路  
点击页码li，触发ajax，通过get的方式获取currentPage，totalPage数据。  
——>调用db中的findNews函数，获得第X页的5条news内容，渲染到页面  
3. 分析难点  
修改paginator插件的js，将页面的查询页码传入ajax中  
把totalPage传入js，修改页码页数  
4. 解决方法   
通过中的查询条件，修改page值  
```/blog/?page=2```
#### Express框架中request 和 response 对象的具体介绍：
```
Request 对象 - request 对象表示 HTTP 请求，包含了请求查询字符串，参数，内容，HTTP 头部等属性。常见属性有：
req.app：当callback为外部文件时，用req.app访问express的实例
req.baseUrl：获取路由当前安装的URL路径
req.body / req.cookies：获得「请求主体」/ Cookies
req.fresh / req.stale：判断请求是否还「新鲜」
req.hostname / req.ip：获取主机名和IP地址
req.originalUrl：获取原始请求URL
req.params：获取路由的parameters
req.path：获取请求路径
req.protocol：获取协议类型
req.query：获取URL的查询参数串
req.route：获取当前匹配的路由
req.subdomains：获取子域名
req.accpets（）：检查请求的Accept头的请求类型
req.acceptsCharsets / req.acceptsEncodings / req.acceptsLanguages
req.get（）：获取指定的HTTP请求头
req.is（）：判断请求头Content-Type的MIME类型

Response 对象 - response 对象表示 HTTP 响应，即在接收到请求时向客户端发送的 HTTP 响应数据。常见属性有：
res.app：同req.app一样
res.append（）：追加指定HTTP头
res.set（）在res.append（）后将重置之前设置的头
res.cookie（name，value [，option]）：设置Cookie
opition: domain / expires / httpOnly / maxAge / path / secure / signed
res.clearCookie（）：清除Cookie
res.download（）：传送指定路径的文件
res.get（）：返回指定的HTTP头
res.json（）：传送JSON响应
res.jsonp（）：传送JSONP响应
res.location（）：只设置响应的Location HTTP头，不设置状态码或者close response
res.redirect（）：设置响应的Location HTTP头，并且设置状态码302
res.send（）：传送HTTP响应
res.sendFile（path [，options] [，fn]）：传送指定路径的文件 -会自动根据文件extension设定Content-Type
res.set（）：设置HTTP头，传入object可以一次设置多个头
res.status（）：设置HTTP状态码
res.type（）：设置Content-Type的MIME类型
```

## 2016年7月22日
#### mongoose的populate，查询ref文档
1.作用：在当前查询到的文档基础上，在通过ref引用查询一个新的属性。  
2.使用ref时，关联的model只匹配_id字段  
3.引用多个属性时， populate(ref1,ref2) ref1和ref2在源文档的顺序必须一致。  

#### async函数整理
async主要实现了三个部分的流程控制功能：  
集合: Collections  
流程控制: Control Flow  
工具类: Utils  
```
1). 集合: Collections
each: 如果想对同一个集合中的所有元素都执行同一个异步操作。 
map: 对集合中的每一个元素，执行某个异步操作，得到结果。所有的结果将汇总到最终的callback里。与each的区别是，each只关心操作不管最后的值，而map关心的最后产生的值。
filter: 使用异步操作对集合中的元素进行筛选, 需要注意的是，iterator的callback只有一个参数，只能接收true或false。
reject: reject跟filter正好相反，当测试为true时则抛弃
reduce: 可以让我们给定一个初始值，用它与集合中的每一个元素做运算，最后得到一个值。reduce从左向右来遍历元素，如果想从右向左，可使用reduceRight。
detect: 用于取得集合中满足条件的第一个元素。
sortBy: 对集合内的元素进行排序，依据每个元素进行某异步操作后产生的值，从小到大排序。
some: 当集合中是否有至少一个元素满足条件时，最终callback得到的值为true，否则为false.
every: 如果集合里每一个元素都满足条件，则传给最终回调的result为true，否则为false
concat: 将多个异步操作的结果合并为一个数组。
```
```
2). 流程控制: Control Flow
*series*: 串行执行，一个函数数组中的每个函数，每一个函数执行完成之后才能执行下一个函数。
**parallel**: 并行执行多个函数，每个函数都是立即执行，不需要等待其它函数先执行。传给最终callback的数组中的数据按照tasks中声明的顺序，而不是执行完成的顺序。
whilst: 相当于while，但其中的异步调用将在完成后才会进行下一次循环。
doWhilst: 相当于do…while, doWhilst交换了fn,test的参数位置，先执行一次循环，再做test判断。
until: until与whilst正好相反，当test为false时循环，与true时跳出。其它特性一致。
doUntil: doUntil与doWhilst正好相反，当test为false时循环，与true时跳出。其它特性一致。
forever: 无论条件循环执行，如果不出错，callback永远不被执行。
waterfall: 按顺序依次执行一组函数。每个函数产生的值，都将传给下一个。
compose: 创建一个包括一组异步函数的函数集合，每个函数会消费上一次函数的返回值。把f(),g(),h()异步函数，组合成f(g(h()))的形式，通过callback得到返回值。
applyEach: 实现给一数组中每个函数传相同参数，通过callback返回。如果只传第一个参数，将返回一个函数对象，我可以传参调用。
queue: 是一个串行的消息队列，通过限制了worker数量，不再一次性全部执行。当worker数量不够用时，新加入的任务将会排队等候，直到有新的worker可用。
cargo: 一个串行的消息队列，类似于queue，通过限制了worker数量，不再一次性全部执行。不同之处在于，cargo每次会加载满额的任务做为任务单元，只有任务单元中全部执行完成后，才会加载新的任务单元。
auto: 用来处理有依赖关系的多个任务的执行。
iterator: 将一组函数包装成为一个iterator，初次调用此iterator时，会执行定义中的第一个函数并返回第二个函数以供调用。
apply: 可以让我们给一个函数预绑定多个参数并生成一个可直接调用的新函数，简化代码。
nextTick: 与nodejs的nextTick一样，再最后调用函数。
**times**: 异步运行,times可以指定调用几次，并把结果合并到数组中返回
timesSeries: 与time类似，唯一不同的是同步执行
```

```
3). 工具类: Utils
memoize: 让某一个函数在内存中缓存它的计算结果。对于相同的参数，只计算一次，下次就直接拿到之前算好的结果。
unmemoize: 让已经被缓存的函数，返回不缓存的函数引用。
log: 执行某异步函数，并记录它的返回值，日志输出。
dir: 与log类似，不同之处在于，会调用浏览器的console.dir()函数，显示为DOM视图。
noConflict: 如果之前已经在全局域中定义了async变量，当导入本async.js时，会先把之前的async变量保存起来，然后覆盖它。仅仅用于浏览器端，在nodejs中没用，这里无法演示。
```

#### Bootstrap分页插件--Bootstrap Paginator
1.官网下载bootstrap-paginator.js文件，在因为该文件之前，需要先引用jquery.js、bootstrap.css  
2.在html中插入代码`<ul id="page-box" class="pagination"></ul>`  
3.添加js代码，自动生成一个页码框  
```js
 var options = {
        size:"small",
        bootstrapMajorVersion:3,
        currentPage: 3,
        numberOfPages: 5,
        totalPages:11
    }
   $('#page-box').bootstrapPaginator(options);
```
4.编写自己的代码js响应文件

---

## 2016年7月19日
#### 匿名函数
```js
//函数声明
function abc(x,y){  
  return x+y;  
}  
//function对象，运用构造函数创建新函数
var abc = new Function("x","y","return x*y;");   
//调用匿名函数，使用()将匿名函数括起来，然后后面再加一对小括号（包含参数列表）
alert((new Function("x","y","return x*y;"))(2,3));  
```



#### js函数调用方法：
函数调用自带两个参数：this 和 arguments(是函数内的固有变量,以数组的形式保存了调用方给该函数传入的所有参数)  
this关键字引用的是,包含它的那个函数,作为某个对象的方法被调用时,所属的那个对象。  
1.方法调用模式。  
请注意this此时**指向myobject**。  
```js
/*方法调用模式*/
    var myobject={
            value:0,
            inc:function(){
                    alert(this.value)
                }
        }
    myobject.inc()
```
2.函数调用模式  
请注意this此时**指向window**  
```js
/*函数调用模式*/
    var add=function(a,b){
        alert(this)//this被绑顶到window
            return a+b;
        }
    var sum=add(3,4);
    alert(sum)
```
3.apply调用模式  
```js
/*apply*/
    //注意使用了上面的sum函数
    //与myobject
    //这中调用方式的优点在于可以指向this指向的对象。
    //apply的第一个参数就是this指针要指向的对象
    var arr=[10,20];
    var sum=add.apply(myobject,arr);
    alert(sum);
```


## js中的fn函数
jQuery.fn===jQuery.prototype  
$.fn是指jquery的命名空间，加上fn上的方法及属性，会对jquery实例每一个有效。   
如扩展$.fn.abc(),即$.fn.abc()是对jquery扩展了一个abc方法,那么后面你的每一个jquery实例都可以引用这个方法了. 
那么你可以这样子：$("#div").abc();   

jQuery为开发插件提拱了两个方法，分别是：   
jQuery.extend(object);为扩展jQuery类本身.为类添加新的方法。   
jQuery.fn.extend(object);给jQuery对象添加方法。


[巧妙运用prototype属性原型链创建对象](http://blog.csdn.net/liuqiwen0512/article/details/8089690)
```js
    //jquery的写法
    function person(na){
         return new person.prototype.init(na);
           }
           person.prototype={
           init:function(na){
                this.name=na;
                return this;
            },
            outName:function(){
                alert(this.name);
            },
            iptName:function(na){
                this.name=na;
            }
           }
             person.prototype.init.prototype=person.prototype;
             //person的原型链赋值给person.prototype.init的原型链，这种方式完美的解决了上面需要加判断的问题，同时也对代码性能进行了优化。
        var person1=person("liuqiwen1");
        person1.outName(); //输出liuqiwen1
        var person2=person("liuqiwen2");
        person2.outName(); //输出liuqiwen2 
        person2.iptName("liuqiwen3"); 
        person2.outName(); //输出liuqiwen3
```
**总结**：  
最初方法：  
创建“创建对象function” ——> 赋值 ——> 创建“添加属性function”(一般赋予方法) ——> 为对象指向方法 ——> new对象 ——> 调用function  
改进之后：  
创建“创建对象function” ——> 创建“添加属性+赋值function” ——> new对象 ——> 调用function  
最终优化：  
创建“new对象+创建对象+添加属性+赋值”function” ——> 跳过new的关键字生成object ——> 调用function  

#### 分页查询函数
`if(err) return next(err);` ：如果出错，转入下一个路由，并传入错误参数err
**未完 **


#### DOM对象和jQury对象之间的相互转换
如果获取的是jQuery对象，则在变量前加上$     `var $variable = jQuery对象`  
如果获取的是DOM对象   `var variable = DOM对象`  
jQuery对象->DOM对象:  
```js
 var $cr = $("#cr");
 var cr  = $cr[0];
```
DOM对象 -> jQuery对象:  
```js
var cr = doucument.getElementById("cr");
var $cr = $(cr);
```
---
## 2016年7月18日
#### nodejs中async库
1.`series(tasks, [callback])` （多个函数依次执行，之间没有数据交换）
有多个异步函数需要依次调用，一个完成之后才能执行下一个。各函数之间没有数据的交换，仅仅需要保证其执行顺序。这时可使用series。  
```js
step1(function(err, v1) {
        step2(function(err, v2) {
                step3(function(err, v3) {
                        // do somethig with the err or values v1/v2/v3
                }
        }
});
```
使用async来处理  
```js
var async = require(‘async’) 
async.series([step1, step2, step3],
    function(err, values) {
        // do somethig with the err or values v1/v2/v3
});
```
举例(依次调用step1、step2、step3，并自动处理每个回调中的错误)：
```js
var async = require(‘async’) async.series([function(cb) {
        step1(function(err, v1) {
                // do something with v1
                cb(err, v1);
        }),
        function(cb) {
                step2(...)
        },
        function(cb) {
                step3(...)
        }],
        function(err, values) {
                // do somethig with the err or values v1/v2/v3
        });
        // 如果任何一个函数向它的回调函数中传了一个error，则后面的函数都不会被执行，并且将会立刻会将该error以及已经执行了的函数的结果，传给series中最后那个callback。 当所有的函数执行完后（没有出错），则会把每个函数传给其回调函数的结果合并为一个数组，传给series最后的那个callback。 还可以json的形式来提供tasks。
```
2.`parallel(tasks, [callback])` （多个函数并行执行）
传给最终callback的数组中的数据按照tasks中声明的顺序，而不是执行完成的顺序。 如果某个函数出错，则立刻将err和已经执行完的函数的结果值传给parallel最终的callback。其它未执行完的函数的值不会传到最终数据，但要占个位置。  
```js
async.parallel({
        a: function(cb) {
                t.fire(‘a400′, cb, 400)
        },
        b: function(cb) {
                t.fire(‘c300′, cb, 300)
        }
},
function(err, results) {
        log(’3 err: ‘, err); // -> undefined
        log(’3 results: ‘, results); // -> { b: ‘c300′, a: ‘a400′ }
});
```
3.`waterfall(tasks, [callback])` （多个函数依次执行，且前一个的输出为后一个的输入）  
4.`auto(tasks, [callback])` （多个函数有依赖关系，有的并行执行，有的依次执行）  
5.`whilst(test, fn, callback)`（用可于异步调用的while）  
6.`until(test, fn, callback)` （与while相似，但判断条件相反）  
7.`queue` （可设定worker数量的队列）  
8.`iterator(tasks)` （将几个函数包装为iterator）  
9.`apply(function, arguments..)` （给函数预绑定参数）  
10.`nextTick(callback)` （在nodejs与浏览器两边行为一致）  
[nodejs中Async库介绍](http://my.oschina.net/huangsz/blog/176203) 


---
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











