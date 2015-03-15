'use strict';

(function() {
    // The given source script string will be evaluated in the scope
    // of this function, with BEST declared as whatever we pass to it.
    // This function is used when loading BEST components as strings
    // from the remote server. BEST component definitions look like this:
    //
    //    BEST.component('component:name', { ... });
    //
    // Eval'ing that source here basically executes that component
    // definition in the way we want. NOTE|TODO: This is a temporary hack
    // to remove once more framework infrastructure has been set up.
    module.exports = function(source, BEST) {
        return eval(source);
    }
}());
