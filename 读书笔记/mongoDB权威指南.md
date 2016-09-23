###1. mongoDB的特性  
Mongodb是一个对象数据库，没有表、行的概念，也没有固定的模式和结构，所有数据以##文档##的形式存储。  
文档是一条记录，多个文档构成一个集合，多个集合构成数据库。  
每个文档系统分配“_id”键，默认是个ObjectId对象(24位的字符串)。  

###2. mongoDB的开启与关闭  

默认接口27017  
开启：
```
mongod --dbpath /usr/local/Cellar/mongodb/3.2.7/data/db    
```
关闭：  
```
 > use admin;
switched to db admin
> db.shutdownServer();   
```
参考文献：[MongoDB：关闭服务](http://blog.sina.com.cn/s/blog_a51dfb960101jynj.html)   

###3. 常用功能函数  
#####  - 增加记录
######### 通过entity创建记录
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
######### 通过javaScript shell增加文档 (在命令行中操作mongoDB)
var post = {"title":"my blog",
			"content":"the first news",
			"date": new Date()
};
PostModel.insert(post);


#####  - 查询记录
######### 查询该实例前身的所有记录
```javascript
    Blog.find(function (err,blogs) {
        console.log(blogs);
    })
    person.find(function(err,persons){
        console.log(persons)
    });
```
######### 单条查询
```javascript
    Blog.findOne({},function (error,data) {
        //没有附加条件就输出所有记录的第一条
        console.log(data);
    })
```
######### or查询 ，$in
```
Model.find({"title":{"$in":[222,333,444]}});
```
######### 排除查询 ，$not
```
Model.find({"title":{"$not":[222,333,444]}});
```
######### null查询, 还要通过$exists查询该键值已存在
```
Model.find({"title":{"$in":[null],"$exists":true}});
```
######### 正则查询/模糊查询
```
Model.find({"title":/joe/i});    //可以匹配各种大小写组合形式的joe
```
#########  指定有序查询
```
Model.find().sort({}).limit(10).skip(10);
/* sort控制排序，limit限制结果数量，skip忽略前n个匹配结果 */
```

##### - 删除记录
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
##### - 修改器 (更新默认只针对符合匹配条件的第一个文档操作)
######### 更新某(几)个键(只能更新一条记录，要求查询条件对应文档唯一)
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
######### 新增一个键 ，$set
```
Model.update({conditions_update},{"$set":{"favoite book":"green eggs"}});
```
######### 删除一个键 ，$unset
```
Model.update({conditions_update},{"$unset":{"favoite book":1}});
```
######### 增加/减少一个键的值 $inc
```
Model.update({conditions_update},{"$inc":{"score":50}});   //给score键值增加/减少50，如果没有这个键就自动新建
```
######### 更新多个文档
设置update的第四个参数为true  
```
Model.update({conditions_update},{"$set":{}},false,true);
```


### 4. 索引  
对集合内的文档预先排序，便于提高查找效率  
```
Model.ensureIndex({"username":1});                       //创建集合的唯一索引
Model.ensureIndex({"username":1}，{“name":"alphabet"});  //创建多索引是，给新索引命名
```

###5. 聚合函数
count 返回集合中的文档数量  
```
Model.count();
Model.count({conditions_count});  //传递查询，计算查询结果的数量
```

distinct 找出给定键的所有不同值   
```
runCommand({"distinct":"Model", "key": "age"});   //查询Model集合中age键的不同值
```
group 依据选定键值的不同将集合分成若干组，聚合每一组内的文档生成一个结果文档  
```
runCommand({"group":{"key":"value"}});    //可以用在展示分类内容
```



###6. 进阶扩展
#### 6.1 数据库命令
```
db.runCommand({"drop":"test"});  等同于db.test.drop();
```  
获取所有命令的最新列表：```db.listCommands();```
常用命令：  
```
//以下省略db.runCommand前缀
{"collStats" : collection}    //返回指定集合的统计信息
{"distinct" : collection, "key": key, "query": query}  //列出指定集合中满足查询条件的文档的指定键的不同值
{"drop" : collection}   //删除集合的所有数据
{"dropDatabase" : 1}   //删除当前数据库的所有数据
{"listDatabase" : 1}   //列出服务器上的所有数据库
```


#### 6.2 固定集合
- 按插入顺序存储文档  
- 顺序查询的操作相当于遍历，所以速度相当快
- 当队列满了，插入新数据，自动淘汰最早的数据  
##### 必须显示创建（相对于普通集合来说）  
```
db.createCollection("my_collection",{capped: true, size:10000});  //使用createCollection创建
db.runCommand({convertToCapped: "test", size: 10000});            //转换已有的普通集合的方式来创建
```

#### 6.3 GridFS : 把文件存进MongoDB  
基本原理：把大文件分成很多块，每块作为一个单独文档存储。  
块集合的文档结构
```
{
    "_id" : ObjectId("..."),
    "n" : 0,                             //n表示块编号，即这个快在原文件中的顺序编号
    "data" : BinData("..."), 
    "files_id" : ObjectId("...")         //包含这个块元数据的文件文档的"_id"
    //文件的元数据，放在另一个集合中，默认是fs.files
} 
```

#### 6.4 服务器端脚本
- ```db.eval("js脚本代码");  // 在服务器端执行脚本```
- 用于存储变量/函数，可以在任何MongoDB的js上下文中调用
- 存储变量，可以在任何MongoDB的js上下文中调用
```
db.system.js.insert({"_id" : "x" , "value" : 1})；   //存入x变量，值为1
db.eval("return x;");                                //返回x的值：1
```
- 存储函数，可以在任何MongoDB的js上下文中调用
```
//存储函数
db.system.js.insert({"_id": "log" , "value":
    function(msg, level) {
        var levels = ["DEBUG", "WARN", "ERROR", "FATAL"];
        level = level ? level :0 ; //检查level是否已定义
        var now = new Date();
        print(now + " " + levels[level] + msg );
    }
})
//调用函数，输出两条日志记录
db.eval("x= 1; log('x is ' + x); 
         x= 2; log('x is greater than 1',1); 
         ");
```

#### 6.5 数据库引用
跨集合、跨数据库引用文档  
```{ "$ref" : collection , "$id" : id_value , "$db" :database };```     
"$db"参数可选可不选，但是三者顺序不可变  












