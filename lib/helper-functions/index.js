module.exports = {
    drop: function(arr, num) {
        return arr.slice(num, arr.length);
    },
    filter: function(arr, iterator) {
        return arr.filter(iterator);
    },
    head: function(arr) {
        return arr[0];
    },
    init: function(arr) {
        return arr.slice(0, arr.length - 1);
    },
    last: function(arr) {
        return arr[arr.length - 1];
    },
    length: function(arr) {
        return arr.length;
    },
    map: function(arr, iterator) {
        return arr.map(iterator);
    },
    max: function(arr) {
        return Math.max.apply(null, arr);
    },
    min: function(arr) {
        return Math.min.apply(null, arr);
    },
    reduce: function(arr, iterator, memo) {
        return arr.reduce(iterator, memo);
    },
    reverse: function(arr) {
        return arr.reverse();
    },
    tail: function(arr) {
        return arr.slice(1, arr.length);
    },
    take: function(arr, num) {
        return arr.slice(0, num);
    },
    timeline: require('./timeline')
};
