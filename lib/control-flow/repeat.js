var VirtualDOM = require('./../virtual-dom/virtual-dom');

var Repeat = {};

var MESSAGES_ATTR_KEY = 'data-messages';
var REPEAT_INFO_KEY = 'repeat-info';

Repeat.process = function process(expandedBlueprint, data) {
    return expandedBlueprint;
}

Repeat.findParentNodes  = function(blueprint, selector, data) {
    var targets = VirtualDOM.query(blueprint, selector);
    data.parentUIDs = [];
    var parentUID;
    var parentDataObj;
    for (var i = 0; i < targets.length; i++) {
        parentUID = VirtualDOM.getUID(targets[i]);

        var parentDataObj = {};
        parentDataObj[parentUID] = {
            blueprint: targets[i],
            repeatedNodes: []
        };
        data.parentUIDs.push(parentDataObj);
    }
}

module.exports = Repeat;
