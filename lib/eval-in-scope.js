'use strict';

/*eslint-disable*/

module.exports = function(source, component) {
    BEST.component = component;
    return eval(source);
};

/*eslint-enable*/
