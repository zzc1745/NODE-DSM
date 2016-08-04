// 权限验证中间件
'use strict';

module.exports = {
    isAuthenticated:function (req,res,next) {
        if (typeof(req.session.user) != 'undefined'){
            // 如果session的user属性非空,则说明已登录,可以进入下一个路由
            return next();
        }else {
            // 检测到session.user为空,证明没有完成登录过,就会一直停留在登录界面
            // 所以该验证函数,要对除login界面外的所有路由都进行验证
            res.redirect('/');
        }
    }
};