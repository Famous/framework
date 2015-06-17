'use strict';

var FamousConnector = require('./../famous-connector/famous-connector');
var DataStore = require('./../data-store/data-store');

var PAYLOAD_KEY = '$payload';
var STATE_MANAGER_KEY = '$state';
var TIMELINES_KEY = '$timelines';
var FRAMEWORK_COMPONENT_KEY = '$component';
var FAMOUS_NODE_KEY = '$famousNode';
var FRAMEWORK_DOM_NODE_KEY = '$domNode';
var DISPATCHER_KEY = '$dispatcher';
var DOM_ELEMENT_KEY = '$DOMElement';
var MESH_KEY = '$mesh';
var INDEX_KEY = '$index';
var REPEAT_PAYLOAD_KEY = '$repeatPayload';
var ROUTE_KEY = '$route';
var EVENT_KEY = '$event';
var GESTURE_HANDLER_KEY = '$GestureHandler';

function getArgs(paramNames, payload, uid) {
    var component = DataStore.getComponent(uid);
    var args = [];
    for (var i = 0; i < paramNames.length; i++) {
        switch (paramNames[i]) {
            case PAYLOAD_KEY: args.push(payload); break;
            case FRAMEWORK_COMPONENT_KEY: args.push(component); break;
            case FAMOUS_NODE_KEY: args.push(component.famousNode); break;
            case FRAMEWORK_DOM_NODE_KEY: args.push(component.tree.getRootNode()); break;
            case STATE_MANAGER_KEY: args.push(component.states.getStateManager()); break;
            case TIMELINES_KEY: args.push(component.timelines); break;
            case DISPATCHER_KEY: args.push(component.events.dispatcher); break;
            case INDEX_KEY: args.push(component.states.get(INDEX_KEY)); break;
            case REPEAT_PAYLOAD_KEY: args.push(component.states.get(REPEAT_PAYLOAD_KEY)); break;
            case ROUTE_KEY: args.push(component.states.get(ROUTE_KEY)); break;
            case DOM_ELEMENT_KEY: args.push(FamousConnector.decorateComponent(component, 'DOMElement')); break;
            case MESH_KEY: args.push(FamousConnector.decorateComponent(component, 'Mesh')); break;
            case EVENT_KEY: args.push(null); break; // `$event` gets overwritten with event object if one exists
            case GESTURE_HANDLER_KEY: args.push(FamousConnector.GestureHandler); break;
            default:
                throw new Error('No such object `' + paramNames[i] + '`');
        }
    }
    return args;
}

module.exports = {
    getArgs: getArgs
};
