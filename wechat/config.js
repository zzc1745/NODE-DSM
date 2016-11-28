var Config = {
    site: {
        title: 'wechat',
        description: '',
        version: '1.0',
    },
    db: {
        cookieSecret: '',
        name: 'wechat',
        host: 'localhost',
        url: 'mongodb://127.0.0.1:27017/wechat'
    },
    site: {
        path:'',
        pagesize: 6
    },
    msg: {
        UNREAD : '0',
        READ : '1'
    }
};
module.exports = Config;

//存储数据库的连接信息
