'use strict';

var Args = require('./../../helpers/args');
var CONTROLLER = {
    '$if': require('./if').handle,
    '$repeat': require('./repeat').handle,
    '$yield': require('./yield').handle
};

function create(behavior, node) {
    if (node.publicEvents[behavior.name]) {
        return function() {
            if (!node.lockControlFlow) {
                var args = Args.fetch(behavior.params, node.stateManager);
                var payload = behavior.action.apply(null, args);
                node.publicEvents[behavior.name](node.stateManager, {
                    payload: payload,
                    selector: behavior.selector,
                    childrenRoot: node.childrenRoot,
                    surrogateRoot: node.surrogateRoot
                });
            }
        };
    }
    else {
        return function() {
            if (!node.lockControlFlow) {
                var args = Args.fetch(behavior.params, node.stateManager);
                var payload = behavior.action.apply(null, args);
                CONTROLLER[behavior.name](
                    behavior.selector,
                    payload,
                    node.childrenRoot,
                    node.surrogateRoot
                );
            }
        };
    }
}

module.exports = {
    create: create
};
