var EventHandler = require('./../utilities/event-handler');
var VirtualDOM = require('./../virtual-dom/virtual-dom');
var Yield = require('./yield');

var IF_KEY = '$if';
var REPEAT_KEY = '$repeat';
var YIELD_KEY = '$yield';


function ControlFlow(behaviorList) {
    EventHandler.apply(this);
    this.controlFlow = ControlFlow.processBehaviorList(behaviorList);
}

ControlFlow.prototype = Object.create(EventHandler.prototype);
ControlFlow.prototype.constructor = ControlFlow;

ControlFlow.prototype.processSelfContainedFlows = function processSelfContainedFlows(blueprint) {
    var expandedBlueprint = VirtualDOM.clone(blueprint);
    this.processIf(expandedBlueprint);
    this.processRepeat(expandedBlueprint);
    this.emit('setExpandedBlueprint', expandedBlueprint);
}

ControlFlow.prototype.processIf = function processIf(expandedBlueprint) {
    var ifBehaviors = this.controlFlow[IF_KEY];
    for (var i = 0; i < ifBehaviors.length; i++) {
        If.process(expandedBlueprint);
    }
}

ControlFlow.prototype.processRepeat = function processRepeat(expandedBlueprint) {
    var repeatBehaviors = this.controlFlow[REPEAT_KEY];
    for (var i = 0; i < repeatBehaviors.length; i++) {
        Repeat.process(expandedBlueprint);
    }
}

ControlFlow.prototype.processParentDefinedFlows = function processParentDefinedFlows(expandedBlueprint, injectablesRoot) {
    var childrenRoot = VirtualDOM.clone(expandedBlueprint)
    this.processYield(childrenRoot, injectablesRoot);
    this.emit('setChildrenRoot', childrenRoot);
}

ControlFlow.prototype.processYield = function processYield(target, injectablesRoot) {
    if (injectablesRoot) {
        var yieldBehaviors = this.controlFlow[YIELD_KEY];
        for (var i = 0; i < yieldBehaviors.length; i++) {
            Yield.process(yieldBehaviors[i], target, injectablesRoot);
        }
    }
}

ControlFlow.processBehaviorList = function processBehaviorList(behaviorList) {
    var controlFlow = {};
    controlFlow[IF_KEY] = [];
    controlFlow[REPEAT_KEY] = [];
    controlFlow[YIELD_KEY] = [];

    for (var i = 0; i < behaviorList.length; i++) {
        switch(behaviorList[i].name) {
            case IF_KEY: controlFlow[IF_KEY].push(behaviorList[i]); break;
            case REPEAT_KEY: controlFlow[REPEAT_KEY].push(behaviorList[i]); break;
            case YIELD_KEY: controlFlow[YIELD_KEY].push(behaviorList[i]); break;
        }
    }

    return controlFlow;
}

module.exports = ControlFlow;
