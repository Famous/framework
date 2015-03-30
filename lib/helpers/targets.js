'use strict';

var VirtualDOM = require('./../virtual-dom');

function fetch(domNode, selector) {
    var targets = [];
    var matches = VirtualDOM.query(domNode, selector);
    for (var i = 0; i < matches.length; i++) {
        var element = matches[i];
        targets.push(element);
    }
    return targets;
}

module.exports = {
    fetch: fetch
};
