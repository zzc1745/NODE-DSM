var Config = {
    site: {
        title: '前端社区',
        description: '用Coding创造财富',
        version: '1.0',
    },
    db: {
        cookieSecret: 'frontendOnlineTest',
        name: 'blog',
        host: 'localhost',
        url: 'mongodb://127.0.0.1:27017/onlineTest'
    },
    site: {
        path:'',
        pagesize: 6
    },
};
module.exports = Config;
