var path = require('path');

var COMPONENT_DELIMITER = ':';

function parts(name) {
    return name.split(COMPONENT_DELIMITER);
}

function base(name) {
    var pieces = parts(name);
    return path.join.apply(path, pieces);
}

function join() {
    return path.join.apply(path, arguments); 
}

function extname() {
    return path.extname.apply(path, arguments);
}

function basename() {
    return path.basename.apply(path, arguments);
}

module.exports = {
    base: base,
    basename: basename,
    extname: extname,
    join: join,
    parts: parts
};
