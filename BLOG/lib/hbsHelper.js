var moment = require('moment');

'use strict';

moment.locale('zh-cn');

module.exports = {     //模块输入函数,在外部调用

    timeFromNow: function (date) {
        return moment(date).fromNow();
    },

    formatDate: function (date) {
        return moment(date).format('LL');  ;
    },

    number: function(value) {
        return Number(value);
    },

    // <
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
    },
    reduce: function (value1, value2) {
        return Number(value1) - Number(value2);
    }
};