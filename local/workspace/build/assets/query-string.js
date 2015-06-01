'use strict';

(function() {
    var SEARCH = window.location.search;
    var QUERY = (function(a) {
        if (a === '') {
            return {};
        }
        if (a[0] === '') {
            a.shift();
        }
        var b = {};
        for (var i = 0; i < a.length; ++i) {
            var p = a[i].split('=', 2);
            if (p.length === 1) {
                b[p[0]] = '';
            }
            else {
                var s = p[1].replace(/\+/g, ' ');
                var sd = decodeURIComponent(s);
                if (sd === 'false') {
                    sd = false;
                }
                else if (sd === 'true') {
                    sd = true;
                }
                b[p[0]] = sd;
            }
        }
        return b;
    })(SEARCH.substr(1).split('&'));
    window.QUERY = QUERY;
}());
