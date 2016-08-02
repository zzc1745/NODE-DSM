var moment = require('moment');

'use strict';

moment.locale('zh-cn');

module.exports = {     //模块输入函数,在外部调用
    //时间间隔计算
    timeFromNow: function (date) {
        return moment(date).fromNow();
    },
    //时间格式显示
    formatDate: function (date) {
        return moment(date).format('LL');  ;
    },
    //转换成数字的类型
    number: function(value) {
        return Number(value);
    },

    // <  升序排列,非升序则调整
    lt: function (value1, value2, block) {
        if (Number(value1) < Number(value2)) {
            return block.fn(this);
        } else {
            return block.inverse(this);
        }
    },

    // <=
    le: function (value1, value2, block) {
        if (Number(value1) <= Number(value2)) {
            return block.fn(this);
        } else {
            return block.inverse(this);
        }
    },

    // >
    gt: function (value1, value2, block) {
        if (Number(value1) > Number(value2)) {
            return block.fn(this);
        } else {
            return block.inverse(this);
        }
    },

    // >=
    ge: function (value1, value2, block) {
        if (Number(value1) >= Number(value2)) {
            return block.fn(this);
        } else {
            return block.inverse(this);
        }
    },
    // 两数差值
    reduce: function (value1, value2) {
        return Number(value1) - Number(value2);
    },

    times: function (n, begin, end, block) {
        if (!begin)
            begin = 0;
        if (!end)
            end = n - 1;
        var accum = '';
        for (var i = begin; i <= end; ++i) {
            this.step = i;
            accum += block.fn(this);
        }
        return accum;
    },

    equals: function (value1, value2, block) {
        if(Number(value1))
            value1 = Number(value1);
        if(Number(value2))
            value2 = Number(value2);

        if (value1 == value2) {
            return block.fn(this);
        } else {
            return block.inverse(this);
        }
    },

    addOne: function (index) {
        return index + 1;
    },
    add: function (value1, value2) {
        return Number(value1) + Number(value2);
    }
    // ,
    // reduce: function (value1, value2) {
    //     return Number(value1) - Number(value2);
    // }
};