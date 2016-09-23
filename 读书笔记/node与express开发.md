#《node与express开发》笔记整理
————————
###chap 2  安装nodejs 
首先用cmd安装brew，使用brew在cmd中安装nodejs。  
npm：node开发包管理器，在安装nodejs的同时系统自动安装。用于安装开发包(package)、管理开发依赖项(package.json)  
npm -g install ：全局安装，在所有项目中都能访问，安装路径在/usr/local/lib/node_modules  
nodejs核心：事件驱动编程。  
#### 创建web服务器
```
var http = require('http');
http.createServer().listen(3000);
```
#### 读取静态资源文件
```
fs.readFile(_dirname + path ,function);         //异步读取文件
fs.readFileSync(_dirname + path ,function);     //同步读取文件
//_dirname 会被解析成当前执行脚本的所在目录
//读取内容成功后，执行回调函数
```
-----
### chap 3 Express
app.js：项目入口文件
#### app.VERB
app.get 是我们添加路由的方法  
app.use 是 Express 添加中间件的一种方法。  
*在 Express 中,路由和中间件的添加顺序至关重要。如果把 404 处理器放在所有路由上面,那首页和关于页面就不能用了,访问这些 URL 得到的都 是 404。*  
Express 能根据回调函数中参数的个数区分 404 和 500 处理器。  
{{{body}}}中所包含的内容：res.render()中的视图参数
#### 静态资源映射
static 中间件可以将一个或多个目录指派为包含静态资源的目录,其中的资源不经过任何 特殊处理直接发送到客户端。相当于给你想要发送的所有静态文件创建了一个路由,渲染文件并发送给客
户端。你可以在其中放图片、CSS 文件、客户端 JavaScript 文件之 类的资源。  
app.use(express.static(__dirname + '/public'));   
*要把静态文件映射的路由添加在所有路由之前*  

----
###chap 4 Git工具

#### git常用命令
```
//进入项目目录
git init   					//创建一个 Git 存储库:
git add [file_name]         //添加指定文件
git add -A                  //添加所有修改
git commit -m"record_name"  //提交修改 并命名
git push -u origin master   //在第一次传输时，添加-u
git push origin master      //之后把修改传输到远程仓库
git checkout -b [branch_name]   //创建一个新分支后检出
```
#### .gitigore
在项目根目录下添加.gitigore文件，使在git时忽略这些文件(夹)
```
node_modules
upload
*~
.DS_Store
```
#### package.json 
- npm init 来初始化创建 package.json 文件
- 描述项目和列出依赖项。
- 存放项目的元数据,比如项目名称、作者、授权信息 等。
----

### chap 6 请求与响应对象
#### URL的组成
```
http://   localhost   :3000    /about   ?test=1     #history
协议       主机名       端口      路径      查询字符串   信息片段
————————————————————————————————————————————————————————————
www     .bing.    com
子域名    服务器    顶级域名
```

#### Http的请求方式：  
- GET：请求向服务器获得渲染  
- POST：请求向服务器后台提交信息  
- 键入URL ————> web服务器接收 ————> HTTP GET请求  

#### 报头信息
请求报头：你访问一个网站时,浏览器会发送很多“隐形”信息。所有能够确保你了解请 求对象头文件属性的信息都将会作为请求报头发送。  
响应报头：当服务器响应时,同样会回传一些 浏览器没必要渲染和显示的信息,通常是元数据和服务器信息。不管 URL 路径是什么,浏览器都根据内容类型报头处理信息。  
内容类型报头信息是一种互联网媒体类型,由一个类型、一个子类型以及可选的参数组成。例如, text/html;charset=UTF-8 说明类型是 text,子类型是 html,字符编码是 UTF-8。  

#### 请求对象（传递到回调方法生命周期始于 Node 的一个核心对象 http.IncomingMessage 的实例）
req常见属性和方法  
```
• req.params
一个数组,包含命名过的路由参数。我们将在第 14 章进行详细介绍。
• req.param(name)
返回命名的路由参数,或者 GET 请求或 POST 请求参数。建议你忽略此方法。
• req.query
一个对象,包含以键值对存放的查询字符串参数(通常称为 GET 请求参数)。
• req.body
一个对象,包含 POST 请求参数。这样命名是因为 POST 请求参数在 REQUEST 正文中传 递,而不像查询字符串在 URL 中传递。要使 req.body 可用,需要中间件能够解析请求 正文内容类型。
• req.route 关于当前匹配路由的信息。主要用于路由调试。
• req.cookies/req.singnedCookies 一个对象,包含从客户端传递过来的 cookies 值。
• req.headers 从客户端接收到的请求报头。
• req.accepts([types]) 一个简便的方法,用来确定客户端是否接受一个或一组指定的类型(可选类型可以是 单个的 MIME 类型,如 application/json、一个逗号分隔集合或是一个数组)。写公共 API 的人对该方法很感兴趣。假定浏览器默认始终接受 HTML。
• req.ip
客户端的 IP 地址。
• req.path 请求路径(不包含协议、主机、端口或查询字符串)。
• req.host 一个简便的方法,用来返回客户端所报告的主机名。这些信息可以伪造,所以不应该用 于安全目的。
• req.xhr
一个简便属性,如果请求由 Ajax 发起将会返回 true。
• req.protocol 用于标识请求的协议(http 或 https)。
• req.secure
一个简便属性,如果连接是安全的,将返回 true。等同于 req.protocol==='https'。
• req.url/req.originalUrl 有点用词不当,这些属性返回了路径和查询字符串(它们不包含协议、主机或端口)。 req.url 若是出于内部路由目的,则可以重写,但是 req.orginalUrl 旨在保留原始请求 和查询字符串。
• req.acceptedLanguages 一个简便方法,用来返回客户端首选的一组(人类的)语言。这些信息是从请求报头中 解析而来的。
```

#### 响应对象（传递到回调方法，生命周期始于 Node 核心对象 http.ServerResponse 的实例）
响应对象中最有用的属性和方法：  
```
• res.status(code)
设置 HTTP 状态代码。Express 默认为 200(成功),所以你可以使用这个方法返回状态 404(页面不存在)或 500(服务器内部错误),或任何一个其他的状态码。对于重定向
(状态码 301、302、303 和 307),有一个更好的方法:redirect。
• res.set(name,value)
 设置响应头。这通常不需要手动设置。
• res.cookie(name,vaue,[options]),res.clearCookie(name,[options])
设置或清除客户端 cookies 值。需要中间件支持,详见第 9 章。
• res.redirect([status],url)
重定向浏览器。默认重定向代码是 302(建立)。通常,你应尽量减少重定向,除非永 久移动一个页面,这种情况应当使用代码 301(永久移动)。
• res.send(body),res.send(status,body)
向客户端发送响应及可选的状态码。Express 的默认内容类型是 text/html。如果你想改 为 text/plain,需要在 res.send 之前调用 res.set('Content-Type','text/plain\')。如 果 body 是一个对象或一个数组,响应将会以 JSON 发送(内容类型需要被正确设置), 不过既然你想发送 JSON,我推荐你调用 res.json。
• res.json(json),res.json(status,json) 向客户端发送 JSON 以及可选的状态码。
• res.jsonp(json),req.jsonp(status,json) 向客户端发送 JSONP 及可选的状态码。
• res.type(type)
一个简便的方法,用于设置 Content-Type 头信息。基本上相当于 res.set('Content- Type','type'),只是如果你提供了一个没有斜杠的字符串,它会试图把其当作文件的 扩展名映射为一个互联网媒体类型。比如,res.type('txt') 会将 Content-Type 设为 text/plain。此功能在有些领域可能会有用(例如自动提供不同的多媒体文件),但是 通常应该避免使用它,以便明确设置正确的互联网媒体类型。
• res.format(object)
这个方法允许你根据接收请求报头发送不同的内容。这是它在 API 中的主要用途,我们 将会在第 15 章详细讨论。这里有一个非常简单的例子:res.format({'text/plain':'hi there','text/html':'<b>hi there</b>'})。
• res.attachment([filename]),res.download(path,[filename],[callback]) 这两种方法会将响应报头 Content-Disposition 设为 attachment,这样浏览器就会选 择下载而不是展现内容。你可以指定 filename 给浏览器作为对用户的提示。用 res. download 可以指定要下载的文件,而 res.attachment 只是设置报头。另外,你还要将 内容发送到客户端。
• res.sendFile(path,[option],[callback]) 这个方法可根据路径读取指定文件并将内容发送到客户端。使用该方法很方便。使用静 态中间件,并将发送到客户端的文件放在公共目录下,这很容易。然而,如果你想根据 条件在相同的 URL 下提供不同的资源,这个方法可以派上用场。
• res.links(links) 设置链接响应报头。这是一个专用的报头,在大多数应用程序中几乎没有用处。
• res.locals,res.render(view,[locals],callback)
res.locals 是一个对象,包含用于渲染视图的默认上下文。res.render 使用配置的模板引擎渲染视图(不能把 res.render 的 locals 参数与 res.locals 混为一谈,上下文 在 res.locals 中会被重写,但在没有被重写的情况下仍然可用)。res.render 的默认响 应代码为 200,使用 res.status 可以指定一个不同的代码。
```
————————————
### 6-2 
#### 渲染小结
将上下文传递给视图,包括查询字符串、cookie 和 session 值
```
app.get('/greeting', function(req, res){ res.render('about', {
                      message: 'welcome',
                      style: req.query.style,
                      userid: req.cookie.userid,
                      username: req.session.username,
}); });
```
渲染纯文本输出
```
app.get('/test', function(req, res){ res.type('text/plain');
             res.send('this is a test');
});
```
200 以外的响应代码
```
app.get('/error', function(req, res){ res.status(500);
             res.render('error');
});
// 或是一行......
app.get('/error', function(req, res){
             res.status(500).render('error');
});
```
#### 处理表单小结
基本表单处理
```
// 必须引入中间件 body-parser app.post('/process-contact', function(req, res){
      });
console.log('Received contact from ' + req.body.name +
        ' <' + req.body.email + '>');
// 保存到数据库...... res.redirect(303, '/thank-you');
```


----
### chap 7 hbs模板引擎
模板作用：在同个文件中融合两种编程语言    
#### 层级与上下文
在 Handlebars 中,**所有的块都会改变上下文**  
if单独使用，在 if 或 else 块中,上下文与上一级上下文是相同的，使用../.访问上级上下文。但是在each嵌套中使用if，得使用 ../../.。  
在{{#each currencies}}块中使用{{.}}。{{.}}指向 当前上下文。  
#### 布局与视图
布局：一种特殊的视图，用于模板的模板。  
视图：通常表现为网站上的各个页面(它也可以表现为页面中 AJAX 局部加载的内容,或一封电子邮件,或页面上的任何东西)。默认情况下,Express 会在 views 子目录中查找视图。  
渲染顺序：渲染视图 ——> 渲染布局  
#### 局部(partial)与段落(section)
使用局部文件(partial)，使有些组成部分(在前端界通常称为“组件”)需要在不同的页面重复使用
{{> partial_name}}可以让你在视图中包含一个局部文件  
使用段落(section)，使你的视图本身可以添加到布局的不同部分  
——————————————
### chap 7-2 handlebars模板引擎语法归纳  
####行级表达式 
{{表达式}}，两个大括弧：返回一个html编码的HTML-escape过的值  
{{{表达式}}}，三个大括弧：可以防止某些html字符被转义，如“/”、“:”等特殊字符，并非指标签  
handlebars.SafeString()：返回不会被转移的字符串  
####块级表达式
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



----
### chap8 表单

#### 获取input内容
`<input>` 标签的 name   
属性:属性用于对提交到服务器后的表单数据进行标识，或者在客户端通过 JavaScript 引用表单数据。  
注释：只有设置了 name 属性的表单元素才能在提交表单时传递它们的值。  
$(this).attr(key); 获取节点属性名的值，$(this).attr(key, value); 设置节点属性的值  
closest() 方法：返回被选元素的第一个祖先元素。  
处理数据：建议用post方式，使用express处理，使用中间件body-parser解析url，激活req.body。  
调动方式：req.body._name 即为name属性为_name的input标签的节点内容  


#### 处理表单流程
提交表单————>处理表单————>url跳转————>跳转到重定向目标  
post———————>在同一url处理表单————>303重定向————>跳转  
get————————>独立路径url处理————>303重定向————>跳转  

#### 重定向
`res.render(303,'/url');  /301也可重定向，但二次跳转回跳过验证过程`  
重定向目标：  
1. 某专用页面，工作量大  
2. 原来的url，需要用某隐藏域暂存url  
3. 预测新的url  

#### Express表单处理
适用get处理表单：req.query.input_name调用input框的内容；  
推荐适用post处理：需要引入中间件body-parser，提高安全性——>激活req.body;适用req.body.input_name来调用input框的内容； 

#### 上传文件
引入formidable中间件，因为它有一个方便的回调方法,能够提供包含字段和文件信息的对象。  
使用formidable必须对form标签指定 enctype="multipart/form-data" 来启用文件上传  
```js
var formidable = require('formidable');
app.get('/contest/vacation-photo',function(req,res){ var now = new Date(); res.render('contest/vacation-photo',{
              year: now.getFullYear(),month: now.getMont()
          });
});
app.post('/contest/vacation-photo/:year/:month', function(req, res){ var form = new formidable.IncomingForm();
form.parse(req, function(err, fields, files){
      //fields：上传路径(通常 是在临时目录中的一个随机名字)； files：文件名
      if(err) 
      return res.redirect(303, '/error'); 
      console.log('received fields:'); 
      console.log(fields);
      console.log('received files:'); 
      console.log(files);
      res.redirect(303, '/thank-you');
      });
});
```
——————————
### chap 9 cookie与会话 
#### cookie
cookie的安全性低，但是必不可少。  
使用cookie前，需要引入cookie-parser。  
##### 设置cookie 
```
res.cookie('monster', 'nom nom');         //普通cookie
res.cookie('signed_monster', 'nom nom', { signed: true });        //签名cookie
```
##### 获取cookie
```
var monster = req.cookies.monster;        //普通cookie
var signedMonster = req.signedCookies.monster;                  //签名cookie
```
##### 删除cookie
```
res.clearCookie: res.clearCookie('monster');
```
##### 检查cookie
chrome —————>  检查 ——————> Resources ——————>  cookies  

#### 会话session
用途：跨页保存用户偏好，省去不同页面的重复登录。  
标注：有cookie，才能使用会话。  
• 方式1，基于 cookie 的会话：把所有东西都存在 cookie 里,或者只在 cookie 里 存一个唯一标识,其他东西都存在服务器上。需要使用cook-parser与cookie-session中间件。  
• *（推荐）*方式2，把会话信息存在服务器上。需要使用cookie-parser与express-session中间件。  
##### 设置session
```
req.session.userName = 'Anonymous';                     //使用请求对象req设置值，因为rep没有session属性
```
##### 获取session
```
var colorScheme = req.session.colorScheme || 'dark';    //使用请求对象req获取值，因为rep没有session属性
```
##### 删除session
``` 
delete req.session.userName;
```

——————————————

### chap 10 中间件
是一种功能的封装方式，在“管道”内顺序执行，通过调用next终止请求。  
三个函数参数：req，res，next。  
中间件js文件类型：  
- 输出一个函数  
- 输出一个以中间件为属性的对象（更灵活）*推荐*  
Express不期望中间件返回值，所以中间件只是用作“验证、处理数据”等过渡作用。  

#### 工作原理
>
• 路由处理器(app.get、app.post等,经常被统称为app.VERB)可以被看作只处理特定 HTTP 谓词(GET、POST 等)的中间件。同样,也可以将中间件看作可以处理全部 HTTP 谓词的路由处理器(基本上等同于 app.all,可以处理任何 HTTP 谓词;对于 PURGE 之 类特别的谓词会有细微的差别,但对于普通的谓词而言,效果是一样的)。  
>
• 路由处理器的第一个参数必须是路径。如果你想让某个路由匹配所有路径,只需用/*。 中间件也可以将路径作为第一个参数,但它是可选的(如果忽略这个参数,它会匹配所 有路径,就像指定了 /\* 一样)。  
>
• 路由处理器和中间件的参数中都有回调函数,这个函数有2个、3个或4个参数(从技 术上讲也可以有 0 或 1 个参数,但这些形式没有意义)。如果有 2 个或 3 个参数,头两 个参数是请求和响应对象,第三个参数是 next 函数。如果有 4 个参数,它就变成了错 误处理中间件,第一个参数变成了错误对象,然后依次是请求、响应和 next 对象。  
>
• 如果不调用next(),管道就会被终止,也不会再有处理器或中间件做后续处理。如果 你不调用 next(),则应该发送一个响应到客户端(res.send、res.json、res.render 等); 如果你不这样做,客户端会被挂起并最终导致超时。  
>
• 如果调用了next(),一般不宜再发送响应到客户端。如果你发送了,管道中后续的中 间件或路由处理器还会执行,但它们发送的任何响应都会被忽略。

——————————————
### chap 11 发送邮件
#### 邮件语言的概念
- 简单邮件传输协议(SMTP)：除非是像 Google 或 Yahoo! 那样的“值得信任的发送者”,否则邮件很可能会直接被扔进垃圾箱。  
- 邮件提交 代理(MSA)：通过可信的渠道投递邮件,降低邮件被标记为垃圾邮件的可能 性。除了确保邮件成功送达,MSA 还处理诸如临时故障造成的滋扰和退回的邮件。  
- 邮件传输代理(MTA)：提供将邮件真正送到其最终目的地的服务。  

#### 邮件消息组成部分
- 头部：包含与邮件有关的信息，所有关于邮件如何到达你这里的信息,邮件经过的所有服务器和 MTA。  
- 主体 ：跟 HTTP 请求非常像  

邮件既可以是普通文本(Unicode),也可以是 HTML。
#### 例子：发送文本邮件
```js
//引入 nodemailer包并创建一个 Nodemailer 实例
var nodemailer = require('nodemailer');
var mailTransport = nodemailer.createTransport('SMTP',{ 
        service: 'Gmail',
        auth: {
            user: credentials.gmail.user,
            pass: credentials.gmail.password,
} });

var mailTransport = nodemailer.createTransport('SMTP',{ 
        host: 'smtp.meadowlarktravel.com', 
        secureConnection: true, //用SSL端口: 465 
        auth: {
              user: credentials.meadowlarkSmtp.user,
              pass: credentials.meadowlarkSmtp.password,
} 
});
//发送邮件
mailTransport.sendMail({
              from: '"Meadowlark Travel" <info@meadowlarktravel.com>',
              to: 'joecustomer@gmail.com',
              subject: 'Your Meadowlark Travel Tour',
              text: 'Thank you for booking your trip with Meadowlark Travel.'+ 'We look forward to your visit!', 
              }, function(err){
            if(err) 
                 console.error( 'Unable to send email: ' + error );   
            //没有错误不一定表示邮件成功发给 了接收者:只有在跟 MSA 通信出现问题时才会设置回调函数的 err 参数
});
```
#### 例子：发送HTML邮件
```js
mailTransport.sendMail({
              from: '"Meadowlark Travel" <info@meadowlarktravel.com>',
              to: 'joecustomer@gmail.com, "Jane Customer" ' +
                      '<janecustomer@gyahoo.com>, frecsutomer@hotmail.com',
              subject: 'Your Meadowlark Travel Tour',
              html: '<h1>Meadowlark Travel</h1>\n<p>Thanks for book your trip with ' + 'Meadowlark Travel. <b>We look forward to your visit!</b>', 
              generateTextFromHtml: true,        //Nodemailer 会自动将 HTML 翻译成普通文本
    }, function(err){
    if(err)
        console.error( 'Unable to send email: ' + error );
});

```

#### 封装邮件功能
```js
    var nodemailer = require('nodemailer');
    module.exports = function(credentials){
    var mailTransport = nodemailer.createTransport('SMTP',{ 
            service: 'Gmail',
            auth: {
                     user: credentials.gmail.user,
                     pass: credentials.gmail.password,
            }
         });
    var from = '"Meadowlark Travel" <info@meadowlarktravel.com>'; var errorRecipient = 'youremail@gmail.com';
    return {
        send: function(to, subj, body){
            mailTransport.sendMail({
                from: from,
                to: to,
                subject: subj,
                html: body, generateTextFromHtml: true
            }, function(err){
            if(err) 
                console.error('Unable to send email: ' + err);
            });
        }),
        emailError: function(message, filename, exception){
            var body = '<h1>Meadowlark Travel Site Error</h1>' + 'message:<br><pre>' + message + '</pre><br>'; 
            if(exception) 
                body += 'exception:<br><pre>' + exception + '</pre><br>';
            if(filename) 
                body += 'filename:<br><pre>' + filename + '</pre><br>';
            mailTransport.sendMail({
                from: from,
                to: errorRecipient,
                subject: 'Meadowlark Travel Site Error', html: body,
                generateTextFromHtml: true
            }, function(err){
            if(err)
                 console.error('Unable to send email: ' + err);
            }); 
        },
 }
```
```js
//调用邮件对象属性
    var emailService = require('./lib/email.js')(credentials); 
    emailService.send('joecustomer@gmail.com', 
                    'Hood River tours on sale today!',
                    'Get \'em while they\'re hot!');
```

——————————————
### chap 13 持久化
用来存储文档数据库。  
#### 方式一：文件系统持久化
将数据存到扁平文件中，文件没有内在结构,只是一串字节，定位、排序和过滤数据就变成了应用 程序的负担。  
#### 方式二：数据库持久化
NoSQL比关系数据库更简单。NoSQL数据库是文档数据库和键 - 值数据库。文档数据库善于存储对象, 这使得它们非常适合 Node 和 JavaScript。键 - 值数据库如其名所示,极其简单,对于数据 模式可以轻松映射到键 - 值对的程序来说是很好的选择。  
使用文档数据库中的MongoDB， 需要引入MongoDB ODM（对象文档映射），是 Mongoose。  

创建连接：
```js
var mongoose = require('mongoose'); var opts = {
         server: {
            socketOptions: { keepAlive: 1 }
} };
mongoose.connect(credentials.mongo.development.connectionString, opts);
```
创建模式（Schema）和模型（Model）：
```js
var mongoose = require('mongoose');
//创建模式
var vacationSchema = mongoose.Schema({ 
         name: String,
         slug: String,
         category: String,
         sku: String,
         description: String,
         priceInCents: Number,
         tags: [String],         //字符串数组
         inSeason: Boolean,
         available: Boolean,
         requiresWaiver: Boolean,
         maximumGuests: Number,
         notes: String,
         packagesSold: Number,
});
vacationSchema.methods.getDisplayPrice = function(){
        return '$' + (this.priceInCents / 100).toFixed(2); 
        };

//用 mongoose.model 创建模型
var Vacation = mongoose.model('Vacation', vacationSchema); module.exports = Vacation;
```

添加初始数据：
```js
 //第一次执行时,find 返回的是空列表
Vacation.find(function(err, vacations){ 

        if(vacations.length) return;    //避免重复添加初始数据。如果数据库中已经有度假包了,那就是已经添加过了
        new Vacation({
            name: 'Hood River Day Trip',
            slug: 'hood-river-day-trip',
            category: 'Day Trip',
            sku: 'HR199',
            description: 'Spend a day sailing on the Columbia and ' +
            'enjoying craft beers in Hood River!',
            priceInCents: 9995,
            tags: ['day trip', 'hood river', 'sailing', 'windsurfing', 'breweries'], inSeason: true,
            maximumGuests: 16,
            available: true,
            packagesSold: 0,
        }).save();
});
```

获取数据：
```js
app.get('/vacations', function(req, res){
Vacation.find({ available: true }, function(err, vacations){
        var context = {
            vacations: vacations.map(function(vacation){
                return {
                // Handlebars 视图无法在表达式中使用函数的输出，所以需要映射到对象
                sku: vacation.sku,
                name: vacation.name,
                description: vacation.description, price: vacation.getDisplayPrice(), inSeason: vacation.inSeason,
                } })
        };
        res.render('vacations', context);
    });
});

```

添加数据：
```js
//邀请客户在度假重新变得应季时接收通知中间件 单独存一个集合
var mongoose = require('mongoose');
var vacationInSeasonListenerSchema = mongoose.Schema({ email: String,
          skus: [String],
      });
var VacationInSeasonListener = mongoose.model('VacationInSeasonListener', vacationInSeasonListenerSchema);
      module.exports = VacationInSeasonListener;

//路由调用，
app.get('/notify-me-when-in-season', function(req, res){ 
    res.render('notify-me-when-in-season', { sku: req.query.sku });
});
app.post('/notify-me-when-in-season', function(req, res){ 
        VacationInSeasonListener.update(
            { email: req.body.email },
            { $push: { skus: req.body.sku } },  // $push 表明我们想添加一个值到数组中
            { upsert: true },     // upsert(“更新”和“插入”的混成词),如果给定邮件地址的记录不存在,就会创建它。如果记录存在,就更新它。
        function(err){
             if(err) { 
             console.error(err.stack); 
             req.session.flash = {
                  type: 'danger',
                  intro: 'Ooops!',
                  message: 'There was an error processing your request.',
                };
             return res.redirect(303, '/vacations'); 
             }
             req.session.flash = {
                  type: 'success',
                  intro: 'Thank you!',
                  message: 'You will be notified when this vacation is in season.',
              };
            return res.redirect(303, '/vacations'); }
        ); 
});

```

用MongoDB存储会话数据：  
需要引入session-mongoose包，用来记住用户偏好（如转换币种的偏好）。  

————————————

### chap 14  路由
路由是将请求(由 URL 和 HTTP 方法指定)路由到处理它们的代码去的一种机制。  
SEO：搜索引擎优化  
#### 实现持久的 IA（信息架构）的建议：  
• 绝不在URL中暴露技术细节。如URL以“.asp”结尾的网站暴露年份。  
• 避免在URL中出现无意义的信息  
• 避免无谓的长URL。在同等条件下,短的 URL 比长的 URL 好。然而你不应该为了缩短 URL 牺牲清晰性。  
• 单词分隔符要保持一致  
• 绝不要用空格或不可录入的字符  
• 在URL中用小写字母  

#### 子域名
Express 中的路由机制默认不会把子域名考虑在内
如果你想分开处理子域名,可以用 vhost 包(表示“虚拟主机”,源自 Apache 的机制,一般用来处理子域名)。
```js
// 创建子域名 "admin" ......它应该出现在所有其他路由之前
var admin = express.Router();        //express.Router() 本质上是创建了一个新的 Express 路由器实例
app.use(vhost('admin.*', admin));
// 创建 admin 的路由;它们可以在任何地方定义 admin.get('/', function(req, res){
              res.render('admin/home');
});
admin.get('/users', function(req, res){
              res.render('admin/users');
});
```

#### 路由处理器
同一个路由有两个处理器。一般只处理第一个。  
如果想处理多个，可以在一个app.get使用任意多个处理器。  
```js    
//这个例子中,三种不同的响应出现的几率差不多
app.get('/foo', function(req,res, next){
          if(Math.random() < 0.33) 
              return next(); 
          res.send('red');
          },
          function(req,res, next){
              if(Math.random() < 0.5) return next(); 
              res.send('green');
          }, 
          function(req,res){
              res.send('blue');
          }, 
);
          
```

```js
//创建可以用在任何路由中的通用函数
function specials(req, res, next){
    res.locals.specials = getSpecialsFromDatabase(); 
    //创建一个函数,将 specials 注入到 res.locals 属性中
    next();

}
app.get('/page-with-specials', specials, function(req,res){
     res.render('page-with-specials');
});
```


#### 路由路径
路由中指定的路径(比如 /foo)最终会被 Express 转换成一个正则表达式。某些正则表达式中的元字符可以用在路由路径中:+、?、*、( 和 )。  

##### 常用正则表达式

```js
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
```

#### 路由参数
一种把变量参数放到路由中成为其一部分的办法。  
```js
var staff = { portland: {
                     mitch: { bio: 'Mitch is the man to have at your back.' },
                     madeline: { bio: 'Madeline is our Oregon expert.' },
            }, 
              bend: {
                     walt: { bio: 'Walt is our Oregon Coast expert.' },
            }
};
//使用 :name。它会跟任何字符串匹配(不包括反斜杠),并将其跟 键name一起放到req.params对象中。
app.get('/staff/:city/:name', function(req, res){
      var info = staff[req.params.city][req.params.name]; 
      if(!info) return next(); // 最终将会落入 404
      res.render('staffer', info);
});

```

——————
### chap 16 静态内容
静态资源：  
· 多媒体  
· CSS  
· JavaScript  
· 二进制下载文件  

如何处理静态资源对网站的性能有很大影响,特别是网站有很多多媒体内容时。在性能上主要考虑两点:减少请求次数和缩减内容的大小。  
减少(HTTP)请求的次数更关键,特别是对移动端来说(通过蜂窝网络发起一次 HTTP 请求的开销要高很多)。    
有两种办法可以减少请求的次数:合并资源和浏览器缓存。  
1. 合并资源主要是架构和前端问题:要尽可能多地将小图片合并到一个子画面中。然后用 CSS 设定偏移量和尺寸只显示图片中需要展示的部分。推荐用 SpritePad(http:// wearekiss.com/spritepad)的免费服务创建子画面。  
2. 浏览器缓存会在客户端浏览器中存储通用的静态资源,这对减少 HTTP 请求有帮助。  

#### 视图中的静态映射
```js
// 设置 handlebars 视图引擎
var handlebars = require('express3-handlebars').create({
         defaultLayout:'main',
         helpers: {
              //添加了一个 Handlebars 辅助函数 static,让它调用静态资源映射器
              static: function(name) {
              return require('./lib/static.js').map(name);
} }
});
```
```html
//layout层的文件映射
<header>
    <img src="{{static '/img/logo.jpg'}}" alt="Meadowlark Travel Logo">
</header>
```

#### CSS中的静态资源
像 LESS、Sass 和 Stylus 这样的 CSS 预处理器全都支持变量,以LESS为例。  
GRUNT同步刷新调用LESS预处理器，并在LESS中创建static函数。  

#### 服务器端JavaScript中的静态资源
```js
//handlebars文件中设定定制的 JavaScript 变量
<script>
  var IMG_CART_EMPTY = '{{static '/img/shop/cart_empty.png'}}'; 
  var IMG_CART_FULL = '{{static '/img/shop/cart_full.png'}}';
</script>
//在 jQuery中使用那些变量:
$(document).on('meadowlark_cart_changed', function(){ 
  $('header img.cartIcon').attr('src', cart.isEmpty() ?IMG_CART_EMPTY : IMG_CART_FULL );
 });
```

#### 关于提供静态资源的响应头信息
• Expires/Cache-Control 这两个响应头信息告诉浏览器一个资源可以缓存的最长时间。浏览器会认真对待它们: 如果它们告诉浏览器某个资源要缓存一个月,那么在这一个月里只要缓存中有这个资 源,浏览器绝不会重新下载。一定要知道,出于某些你不可控的原因,浏览器可能会提 前从缓存中移除图片。比如用户手动清除了缓存,或浏览器为了给用户访问更频繁的某 些资源腾出空间清除了你的资源。你只需要其中一个响应头,支持 Expires 的更多,所 以应该优先选择它。如果资源在缓存中,而且它还没过期,浏览器就绝对不会发起 GET 请求,这会提升性能,特别是在移动端上。  
• Last-Modified/ETag 这两个标签提供了某种版本化:如果浏览器需要获取资源,它会在下载之前检查这些标 签。还会向服务器发起 GET 请求,但如果这些响应头返回的值让浏览器觉得资源没变, 它就不会继续下载那个文件。如其名所示,Last-Modified 可以指定资源最后一次修改的 时间。ETag 可以是任意字符串,一般是版本字符串或内容的哈希值。


——————————
### chap 17 在Express中实现MVC
MVC：模型 - 视图 - 控制器模式。  
模型是“纯粹”的数据和逻辑。  
视图将模型传递给用户。  
控制器接受用户输入,处理模型,选择要显示哪个(些)视图。控制器和路由器之间唯一的区别是控制器一般会把相关功能归组。  

```js
//控制器，将真正的功能和路由管理分开
    var Customer = require('../models/customer.js');
    var customerViewModel = require('../viewModels/customer.js');
    exports = {
    registerRoutes: function(app) {
        app.get('/customer/:id', this.home); app.get('/customer/:id/preferences', this.preferences); app.get('/orders/:id', this.orders); app.post('/customer/:id/update', this.ajaxUpdate);
        }
    home: function(req, res, next) {
        var customer = Customer.findById(req.params.id); if(!customer) return next(); //将这个传给404处理器 res.render('customer/home', customerViewModel(customer));
        }
    preferences: function(req, res, next) {
        var customer = Customer.findById(req.params.id);
        if(!customer) return next(); //将这个传给404处理器 res.render('customer/preferences', customerViewModel(customer));
        }
    orders: function(req, res, next) {
        var customer = Customer.findById(req.params.id);
        if(!customer) return next(); // 将这个传给404处理器 res.render('customer/preferences', customerViewModel(customer));
        }
    ajaxUpdate: function(req, res) {
        var customer = Customer.findById(req.params.id); 
        if(!customer) 
            return res.json({ error: 'Invalid ID.'}); 
        if(req.body.firstName){
            if(typeof req.body.firstName !== 'string' || req.body.firstName.trim() === '')
                return res.json({ error: 'Invalid name.'});
            customer.firstName = req.body.firstName;
        }
    // 等等......
    customer.save();
    return res.json({ success: true });
    }}
```


——————
### chap 18 安全问题
HTTPS 协议基于服务器上的公钥证书,有时也叫 SSL 证书。
证书颁发机构(CA)发行证书。CA 让浏览器厂商能访问受指令信根证书。在你安装浏览器时,其中就包含这些受信根证书,并靠它们建立起 CA 和浏览 器之间的信任链。要用这个信任链,你的服务器必须使用由 CA 颁发的证书。

#### 生成自己的证书
由于 CA 确立起来的层级性,浏览器只信任由已知 CA(并且那个可能不是你)生成的证书。如果 你的证书来自浏览器不知道的 CA,浏览器会用非常惊悚的语言警告你,说你正在用一个 未知(因此是不可信的)实体建立安全连接。对开发测试人员来说没关系，但是公众不能接受。  
生成方法：
1. brew install openssl  
2. openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout meadowlark.pem -out meadowlark.crt
它会问你一些细节信息,比如国家代码、城市、省(州)、全限定域名(FQDN)、邮件地址等。这个证书是用于开发 / 测试的,你怎么回答关系不大


#### 对Express应用启用HTTPS
```js
原本创建服务器的方法:
    http.createServer(app).listen(app.get('port'), function(){ 
        console.log('Express started in ' + app.get('env') +' mode on port ' + app.get('port') + '.');
    });
  
//现在用https模块替换http模块，把 options 对象传给 createServer 
    var https = require('https'); // 一般在文件顶部 
    var options = {
        key: fs.readFileSync(__dirname + '/ssl/meadowlark.pem');
        cert: fs.readFileSync(__dirname + '/ssl/meadowlark.crt');
        };
    https.createServer(options, app).listen(app.get('port'), function(){ 
    console.log('Express started in ' + app.get('env') + ' mode on port ' + app.get('port') + '.');
    });
```

当访问网站时,总是会连接到特定的端口上,即便在URL中没有指定也是这样的。
在同一个端口上连接 HTTP 和 HTTPS 是不可能的。  
在大多数操作系统上,端口 1~1024 需要提升权限才能打开。（比如在 Linux和OS X机器上,如果你试图在端口80上启动应用,会因为EACCES错误而失败。 要在端口 80 或 443(或者任何低于 1025 的端口)上运行,你需要用 sudo 命令提升权限。 如果你没有管理员权限,就无法直接在端口 80 或 443 上启动服务器。）  

#### 授权认证
认证是指验证用户的身份,即他们是自己所宣称的人。  
授权是指确定用户有哪些权力,可以访问、修改或查看什么。  

#### 第三方认证
具体流程：
我的登录网站 ——————> 通过302、307重定向到第三方登录界面 ————> 回到我的原登录网站完成时授权  
--- 为什么第三方网站可以重新定向回原登录网站？  
--- 因为当访问一个 URL 时,并不是你在向服务器发起请求,实际上是浏览器发起的。也就是浏览器可以做三件事:发起 HTTP 请求、显示响应、执行重定向

#### 基于角色的授权
```js
//员工与普通用户访问权限不同
function allow(roles) {
    var user = req.session.passport.user;
    if(user && roles.split(',').indexOf(user.role)!==-1) 
    //只有当用户角色为employee的时候，才能触发next();进入员工界面
        return next(); 
    res.redirect(303, '/unauthorized');
}
app.get('/account', allow('customer,employee'), function(req, res){ 
    res.render('account');
});
```


——————
### chap 19 集成第三方API

#### 集成推特为例
```js 
var https = require('https'); 
module.exports = function(twitterOptions){    //模块输出了一个函数到传给配置对象的调用者中
    return {                                  //函数返回的是一个包含方法的对象
        search: function(query, count, cb){
            getAccessToken(function(accessToken){
                var options = {
                hostname: 'api.twitter.com',
                port: 443,
                method: 'GET',
                path: '/1.1/search/tweets.json?q=' +
                        encodeURIComponent(query) +
                        '&count=' + (count || 10),
                headers: {
                        'Authorization': 'Bearer ' + accessToken,
                },
             };
            https.request(options, function(res){ 
                var data = '';
                res.on('data', function(chunk){ 
                    data += chunk;
                });
            res.on('end', function(){
                    cb(JSON.parse(data));
                    });
                }).end();
            });
        },

      }
}; 

//调用search方法
//第一次调用这个函数时,它会向Twitter API发起一个请求获取访问令牌。
var twitter = require('./lib/twitter')({
    consumerKey: credentials.twitter.consumerKey, 
    consumerSecret: credentials.twitter.consumerSecret,
});
twitter.search('#meadowlarktravel', 10, function(result){
    // 推文会在 result.statuses 中
});

```

### chap 20 调试
#### chrome 调试断点技巧：
- `{ }`可以把压缩代码优化成可读性强的代码  
- `resume script execution` 恢复执行脚本  
- 打开js代码，设置/取消断点，右侧“breakpoints列表可以查看断点  
- 箭头加斜杠标识，表示临时禁用所有断点 
- call stack（调用栈），可以查看当前断点所处的方法调用栈，可以嵌套调用，也就是说可以含有断点的最外层函数也会被包含进来调用栈中的每一层叫做一个frame，点击每个frame可以跳到该frame的调用点上。  
- scope中查看变量具体的参数




















