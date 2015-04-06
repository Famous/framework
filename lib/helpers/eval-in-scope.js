'use strict';

/*eslint-disable*/

// The given source script string will be evaluated in the scope
// of this function, with BEST declared as whatever we pass to it.

module.exports = function(source, BEST, $B) {
    return eval(source);
};

/*eslint-enable*/
