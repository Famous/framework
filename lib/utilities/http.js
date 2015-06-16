'use strict';

// Make an HTTP GET request to the given URL, returning
// the results to the given callback.
function get(url, cb) {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4 && xhr.status === 200) {
            cb(xhr.responseText);
        }
    };
    xhr.open('GET', url, true);
    xhr.send();
}

// GET request all of the given URLs, returning the
// collection of results when all have completed.
function join(urls, cb) {
    var total = 0;
    var length = urls.length;
    var out = [];
    if (length < 1) {
        return cb(out);
    }
    for (var i = 0; i < length; i++) {
        (function(idx) {
            var url = urls[idx];
            get(url, function(data) {
                total += 1;
                // Important! We guarantee that results are returned
                // in the same order the URLs were given in, hence
                // assigning via index rather than pushing.
                out[idx] = data;
                if (total === length) {
                    cb(out);
                }
            });
        }(i));
    }
}

module.exports = {
    get: get,
    join: join
};
