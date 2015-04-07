'use strict';

var VirtualDOM = require('./../../virtual-dom');

var SELF_KEY = '$self';
var BOOLEAN = 'boolean';
var STRING = 'string';

function initialization(info) {
    var targets;
    if (info.selector === SELF_KEY) {
        targets = [info.childrenRoot];
    }
    else {
        targets = VirtualDOM.query(info.childrenRoot, info.selector);
    }

    var sources;
    switch (typeof info.payload) {
        case BOOLEAN:
            sources = info.payload ? info.surrogateRoot.childNodes : [];
            break;
        case STRING:
            sources = VirtualDOM.query(info.surrogateRoot, info.payload);
            break;
        default:
            throw new Error('Unsupported payload type for $yield');
    }

    for (var i = 0; i < targets.length; i++) {
        if (sources.length > 0) {
            var target = targets[i];
            while (target.firstChild) {
                target.removeChild(target.firstChild);
            }
            for (var j = 0; j < sources.length; j++) {
                var clone = VirtualDOM.clone(sources[j]);
                target.appendChild(clone);
            }
        }
    }
}

module.exports = {
    initialization: initialization,
    runTime: initialization
};
