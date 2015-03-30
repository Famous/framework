'use strict';

var Args = require('./../../helpers/args');
var Bundle = require('./../../bundle');
var Injector = require('./../../injector');

function create(behavior, node) {
    return function() {
        var args = Args.fetch(behavior.params, node.stateManager);
        var payload = behavior.action.apply(null, args);
        var handler = Bundle.getBehaviorHandler(behavior.name, node);
        var handlerArgs = Injector.getArgs(handler.params, payload, node);
        handler.action.apply(null, handlerArgs);
    };
}

module.exports = {
    create: create
};
