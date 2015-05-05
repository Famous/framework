'use strict';

var VirtualDOM = require('./../virtual-dom/virtual-dom');
var DataStore = require('./../data-store/data-store');

var ROOT_SELECTOR = '$root';

function message(domSelector, componentSelector, key, value) {
    var rootComponent = DataStore.getExecutedComponent(domSelector);
    var targetComponent;
    if (componentSelector === ROOT_SELECTOR) {
        targetComponent = rootComponent;
        targetComponent.sendMessage(key, value);
    }
    else {
        var targets = VirtualDOM.query(rootComponent.getRootNode(), componentSelector);
        for (var i = 0; i < targets.length; i++) {
            targetComponent = DataStore.getComponent(VirtualDOM.getUID(targets[i]));
            targetComponent.sendMessage(key, value);
        }
    }
}

module.exports = {
    message: message
};
