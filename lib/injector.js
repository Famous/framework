'use strict';

var Famous = require('./famous');
var Mustache = require('mustache');

var PAYLOAD_KEY = '$payload';
var STATE_MANAGER_KEY = '$state';
var BEST_NODE_KEY = '$node';
var BEST_DOM_NODE_KEY = '$domNode';
var HTML_ELEMENT_KEY = '$HTMLElement';
var MOUNT_POINT_KEY = '$mountPoint';
var ALIGN_KEY = '$align';
var CAMERA_KEY = '$camera';
var OPACITY_KEY = '$opacity';
var ORIGIN_KEY = '$origin';
var POSITION_KEY = '$position';
var ROTATION_KEY = '$rotation';
var SCALE_KEY = '$scale';
var SIZE_KEY = '$size';
var WEBGL_MESH_KEY = '$webGLMesh';
var GEOMETRY_KEY = '$geometry';
var MATERIAL_KEY = '$material';
var POINT_LIGHT_KEY = '$pointLight';
var AMBIENT_LIGHT_KEY = '$ambientLight';
var MUSTACHE_KEY = '$mustache';

function getArgs(paramNames, payload, node) {
    var args = [];
    for (var i = 0; i < paramNames.length; i++) {
        switch (paramNames[i]) {
            case PAYLOAD_KEY: args.push(payload); break;
            case MUSTACHE_KEY: args.push(Mustache.render); break;
            case BEST_NODE_KEY: args.push(node); break;
            case BEST_DOM_NODE_KEY: args.push(node.domNode); break;
            case STATE_MANAGER_KEY: args.push(node.stateManager); break;
            case MOUNT_POINT_KEY: args.push(Famous.decorateNode(node, 'MountPoint')); break;
            case ALIGN_KEY: args.push(Famous.decorateNode(node, 'Align')); break;
            case CAMERA_KEY: args.push(Famous.decorateNode(node, 'Camera')); break;
            case OPACITY_KEY: args.push(Famous.decorateNode(node, 'Opacity')); break;
            case ORIGIN_KEY: args.push(Famous.decorateNode(node, 'Origin')); break;
            case POSITION_KEY: args.push(Famous.decorateNode(node, 'Position')); break;
            case ROTATION_KEY: args.push(Famous.decorateNode(node, 'Rotation')); break;
            case SCALE_KEY: args.push(Famous.decorateNode(node, 'Scale')); break;
            case SIZE_KEY: args.push(Famous.decorateNode(node, 'Size')); break;
            case GEOMETRY_KEY: args.push(Famous.decorateNode(node, 'Geometry')); break;
            case MATERIAL_KEY: args.push(Famous.decorateNode(node, 'Material')); break;
            case POINT_LIGHT_KEY: args.push(Famous.decorateNode(node, 'PointLight')); break;
            case AMBIENT_LIGHT_KEY: args.push(Famous.decorateNode(node, 'AmbientLight')); break;
            case WEBGL_MESH_KEY: args.push(Famous.decorateNode(node, 'WebGLMesh')); break;
            case HTML_ELEMENT_KEY: args.push(Famous.decorateNode(node, 'HTMLElement')); break;
            default:
                throw new Error('No such object `' + paramNames[i] + '`');
        }
    }
    return args;
}

module.exports = {
    getArgs: getArgs
};
