'use strict';

var babel = require('babel');

var BABEL_OPTIONS = {
    blacklist: [],
    whitelist: [],
    loose: [],
    optional: [],
    nonStandard: true,
    highlightCode: true,
    code: true,
    ast: false,
    stage: 2,
    compact: false,
    comments: true
};

function transform(source) {
    return babel.transform(source, BABEL_OPTIONS).code;
}

module.exports = {
    transform: transform
};
