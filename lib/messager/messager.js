var VirtualDOM = require('./../virtual-dom/virtual-dom');
var DataStore = require('./../data-store/data-store');

var ROOT_SELECTOR = '$root';

function message(domSelector, componentSelector, key, message) {
    var rootComponent = DataStore.getExecutedComponent(domSelector);
    var targetComponent;
    if (componentSelector === ROOT_SELECTOR) {
        targetComponent = rootComponent;
    }
    else {
        targets = VirtualDOM.query(rootComponent.getRootNode(), componentSelector);
        for (var i = 0; i < targets.length; i++) {
            targetComponent = DataStore.getComponent(VirtualDOM.getUID(targets[i]));
            
        }
    }
}

setTimeout(function(){
    BEST.message('body', '#surface');
}, 100)

module.exports = {
    message: message
}