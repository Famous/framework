var Yield = require('./yield');

var IF_KEY = '$if';
var REPEAT_KEY = '$repeat';
var YIELD_KEY = '$yield';


function ControlFlow(behaviorList) {
    this.controlFlow = ControlFlow.processBehaviorList(behaviorList);
}

ControlFlow.prototype.processYield = function processYield(target, injectables) {
    Yield.process(this.controlFlow[YIELD_KEY], target, injectables);
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
