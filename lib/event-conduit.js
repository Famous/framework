var FunctionParser = require('best-function-parser');
var getParameterNames = FunctionParser.getParameterNames;

var ALL_SELECTOR = '*';
var RESERVED_ATTRIBUTES = { 'id': true, 'class': true, 'uid': true };

/**
 * Provide a means to channel events declared in a BEST node's `tree`.
 *
 * Take a fragment of a tree that looks something like this:
 *    <foo:bar famous:events:click="handle=click">
 *
 * The event conduit is a system that maps the trigger name
 * `'famous:events:click'` to the module that knows how to set that
 * event listener up in the substrate, and maps the event-handler
 * name `'handle-click'` to the event handler in the encompassing
 * BEST node.
 */
function EventConduit(bestApplication, bestNode) {
    var childrenRoot = bestNode.childrenRoot;
    var descendants = childrenRoot.querySelectorAll(ALL_SELECTOR);
    for (var i = 0; i < descendants.length; i++) {
        var descendant = descendants[i];
        var descendantUID = descendant.bestUID;
        var descendantBestNode = bestApplication.bestNodes[descendantUID];
        var attributes = descendant.attributes;
        for (var key in attributes) {
            if ((isNaN(key))) continue; // Numeric keys are user-defined
            if ((attributes[key].name in RESERVED_ATTRIBUTES)) continue;
            var attribute = attributes[key];
            var channelName = attribute.name; // Name of the event trigger to setup in the substrate
            var registrantName = attribute.value; // Name of the event handler in the BEST node
            var eventTrigger = bestApplication.fetchBehaviorHandler(channelName, bestNode);
            var eventHandler = bestNode.publicEvents[registrantName];
            if (!eventHandler) continue;
            var triggerPayload = { registrant: eventHandler, stateManager: bestNode.stateManager };
            var eventTriggerDeps = getParameterNames(eventTrigger);
            var eventTriggerArgs = bestApplication.fetchDependencies(eventTriggerDeps, triggerPayload, descendantBestNode);
            eventTrigger.apply(null, eventTriggerArgs);
        }
    }
}

module.exports = EventConduit;
