'use strict';

var FamousConnector = require('../famous-connector/famous-connector');
var Mustache = require('mustache');
var DataStore = require('../data-store/data-store');

var PAYLOAD_KEY = '$payload';
var STATE_MANAGER_KEY = '$state';
var BEST_COMPONENT_KEY = '$component';
var FAMOUS_NODE_KEY = '$famousNode';
var BEST_DOM_NODE_KEY = '$domNode';
var DISPATCHER_KEY = '$dispatcher';
var DOM_ELEMENT_KEY = '$DOMElement';
var CAMERA_KEY = '$camera';
var WEBGL_MESH_KEY = '$webGLMesh';
var GEOMETRY_KEY = '$geometry';
var MATERIAL_KEY = '$material';
var POINT_LIGHT_KEY = '$pointLight';
var AMBIENT_LIGHT_KEY = '$ambientLight';
var MUSTACHE_KEY = '$mustache';

function getArgs(paramNames, payload, uid) {
    var component = DataStore.getComponent(uid);
    var args = [];
    for (var i = 0; i < paramNames.length; i++) {
        switch (paramNames[i]) {
            case PAYLOAD_KEY: args.push(payload); break;
            case MUSTACHE_KEY: args.push(Mustache.render); break;
            case BEST_COMPONENT_KEY: args.push(component); break;
            case FAMOUS_NODE_KEY: args.push(component.famousNode); break;
            case BEST_DOM_NODE_KEY: args.push(component.tree.getRootNode()); break;
            case STATE_MANAGER_KEY: args.push(component.states.getStateManager()); break;
            case DISPATCHER_KEY: args.push(component.events.dispatcher); break;
            case CAMERA_KEY: args.push(FamousConnector.decorateComponent(component, 'Camera')); break;
            case GEOMETRY_KEY: args.push(FamousConnector.decorateComponent(component, 'Geometry')); break;
            case MATERIAL_KEY: args.push(FamousConnector.decorateComponent(component, 'Material')); break;
            case POINT_LIGHT_KEY: args.push(FamousConnector.decorateComponent(component, 'PointLight')); break;
            case AMBIENT_LIGHT_KEY: args.push(FamousConnector.decorateComponent(component, 'AmbientLight')); break;
            case WEBGL_MESH_KEY: args.push(FamousConnector.decorateComponent(component, 'WebGLMesh')); break;
            case DOM_ELEMENT_KEY: args.push(FamousConnector.decorateComponent(component, 'DOMElement')); break;
            default:
                throw new Error('No such object `' + paramNames[i] + '`');
        }
    }
    return args;
}

module.exports = {
    getArgs: getArgs
};
