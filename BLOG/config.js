var Config = {
    site: {
        title: '前端社区',
        description: '用Coding创造财富',
        version: '1.0',
    },
    db: {
        cookieSecret: 'frontendblog',
        name: 'blog',
        host: 'localhost',
        url: 'mongodb://127.0.0.1:27017/test'
    },
    site: {
        path:'',
        pagesize: 6
    },
    news: {
        path:''
    }
};
module.exports = Config;

//存储数据库的连接信息