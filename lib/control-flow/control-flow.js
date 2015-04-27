var EventHandler = require('./../utilities/event-handler');
var Events = require('./../events/events');
var VirtualDOM = require('./../virtual-dom/virtual-dom');
var Behaviors = require('./../behaviors/behaviors');
var DataStore = require('./../data-store/data-store');
var If = require('./if');
var Repeat = require('./repeat');
var Yield = require('./yield');
var ArrayUtils = require('framework-utilities/array');

var IF_KEY = '$if';
var REPEAT_KEY = '$repeat';
var YIELD_KEY = '$yield';


function ControlFlow(behaviorList) {
    EventHandler.apply(this);
    this.controlFlow = ControlFlow.processBehaviorList(behaviorList);
    this.repeatData = {
        /*
        '.selector' :
            initialized: false,
            parentUIDs: [{
                uid: uid1
                blueprint: node,
                repeatedNodes: [node1, node2, node3]
            }],
            payload: [{}, {}, {}],
            payloadEquality: [true, true, false]
         */
    };
}

ControlFlow.prototype = Object.create(EventHandler.prototype);
ControlFlow.prototype.constructor = ControlFlow;

ControlFlow.prototype.processSelfContainedFlows = function processSelfContainedFlows(blueprint, uid) {
    var expandedBlueprint = VirtualDOM.clone(blueprint);
    this.processIf(expandedBlueprint, uid);
    this.processRepeatBehaviors(blueprint, expandedBlueprint, uid);
    this.emit('setExpandedBlueprint', expandedBlueprint);
}

ControlFlow.prototype.processIf = function processIf(expandedBlueprint, uid) {
    var ifBehaviors = this.controlFlow[IF_KEY];
    for (var i = 0; i < ifBehaviors.length; i++) {
        If.process(expandedBlueprint);
    }
}

function verifyRepeatPayload(payload) {
    if (!(payload instanceof Array)) {
        throw new Error('Unsupported payload type for $repeat: `' + payload + '`');
    }
}
ControlFlow.prototype.processRepeatBehaviors = function processRepeatBehaviors(blueprint, expandedBlueprint, uid) {
    var repeatBehaviors = this.controlFlow[REPEAT_KEY];
    for (var i = 0; i < repeatBehaviors.length; i++) {
        this.processRepeatBehavior(repeatBehaviors[i], expandedBlueprint, uid, blueprint);
    }
}

ControlFlow.prototype.processRepeatBehavior = function processRepeatBehavior(behavior, expandedBlueprint, uid, blueprint) {
    var component = DataStore.getComponent(uid);
    var behavior;
    var repeatPayload;
    var data;
    repeatPayload = Behaviors.getPayload(behavior, component);
    verifyRepeatPayload(repeatPayload);

    if (!this.repeatData[behavior.selector]) {
        this.repeatData[behavior.selector] = {};
    }
    data = this.repeatData[behavior.selector];
    data.payloadEquality = ArrayUtils.checkElementEquality(data.payload || [], repeatPayload);
    data.payload = repeatPayload;

    if (!data.initialized) {
        Repeat.findParentNodes(blueprint, expandedBlueprint, behavior.selector, data);
        data.initialized = true;
    }

    Repeat.process(expandedBlueprint, data);
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
