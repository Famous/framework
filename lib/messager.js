'use strict';

function Messager() {

}

module.exports = Messager;

//BestApplication.prototype.send = function(selector, key, message) {
//    var bestNode;
//    if (selector === '$root') {
//        bestNode = this.bestNodes[this.DOMNode.getAttribute(UID_KEY)];
//        bestNode.eventManager.send(key, message);
//    }
//    else {
//        var _wrapper = document.createElement('_wrapper');
//        var clonedNode = this.DOMNode.cloneNode(DO_CLONE_ATTRIBUTES);
//        _wrapper.appendChild(clonedNode);
//        var targetElements = _wrapper.querySelectorAll(selector);
//        for (var i = 0; i < targetElements.length; i++) {
//            bestNode = this.bestNodes[targetElements[i].getAttribute(UID_KEY)];
//            bestNode.eventManager.send(key, message);
//        }
//    }
//
//    return this;
//};
