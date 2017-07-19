// Handlebars Helpers

var shuffle = function (array) {
    var i = array.length, j, swap;
    while (i) {
        j = Math.floor(Math.random() * i--);
        swap = array[i];
        array[i] = array[j];
        array[j] = swap;
    }
    return array;
};

var helpers = {
    shuffle: function (array, count, options) {
        count = ( typeof count === 'number' ) ? count : 4;

        var shuffled = shuffle(array.slice(0, count)),
            result = '';

        for (var i = 0; i < shuffled.length; i++) {
            result += options.fn(shuffled[i]);
        }

        return result;
    },
    everyNth: function (context, every, options) {
        var fn = options.fn, inverse = options.inverse;
        var ret = "";
        if (context && context.length > 0) {
            for (var i = 0, j = context.length; i < j; i++) {
                var modZero = i % every === 0;
                ret = ret + i;
            }
        } else {
            ret = inverse(this);
        }
        return ret;
    }
};

module.exports.register = function (Handlebars, options) {
    'use strict';

    options = options || {};

    for (var helper in helpers) {
        Handlebars.registerHelper(helper, helpers[helper]);
    }
    return this;
};
