'use strict';

var createBehaviorList = require('./support/create-behavior-list');
var ObjUtils = require('framework-utilities/object');
var StateManager = require('best-state-manager');
var EventManager = require('./event-manager');
var BehaviorConduit = require('./behavior-conduit');
var EventConduit = require('./event-conduit');
var YieldConduit = require('./yield-conduit');
var DOM_PARSER = new DOMParser();

var UID_KEY = 'uid';
var PUBLIC_EVENTS_KEY = 'public';
var HANDLER_EVENTS_KEY = 'handlers';
var TREE_DATA_TYPE = 'text/html';
var DO_CLONE_ATTRIBUTES = true;
var EMPTY_TREE = '';
var YIELD_KEY = '$yield';
var STATE_AUTOTRIGGER_RE = /^[a-zA-Z0-9].*/i;

function BestNode(name, bestDOMNode, parentBestNode, definition, FamousApplication) {
    this.DOMNode = bestDOMNode;
    this.parentNode = parentBestNode;
    this.uid = Math.random().toString(36).slice(2);
    bestDOMNode.setAttribute(UID_KEY, this.uid);
    bestDOMNode.bestUID = this.uid; // Easier access
    this.name = name;

    if (definition) {
        this.isComponent = true;
        this.behaviorList = createBehaviorList(ObjUtils.clone(definition.behaviors || {}));
        var statesObject = ObjUtils.clone(definition.states || {});
        var eventsObject = ObjUtils.clone(definition.events || {});
        this.publicEvents = ObjUtils.clone(eventsObject[PUBLIC_EVENTS_KEY] || {});
        this.handlerEvents = ObjUtils.clone(eventsObject[HANDLER_EVENTS_KEY] || {});
        var treeString = definition.tree || EMPTY_TREE;
        this.childrenRoot = DOM_PARSER.parseFromString(treeString, TREE_DATA_TYPE).body;
        this.surrogateRoot = bestDOMNode.cloneNode(DO_CLONE_ATTRIBUTES);
        this.stateManager = new StateManager(statesObject, FamousApplication.Clock, FamousApplication.Transitionable);
        this.eventManager = new EventManager(this.stateManager, this.publicEvents);
        this.famousNode = FamousApplication.buildNode();
    }
    else {
        this.isComponent = false; // For e.g. <p> elements
    }
}

BestNode.prototype.addEventConduit = function addEventConduit(bestApplication) {
    this.eventConduit = new EventConduit(bestApplication, this);
};

BestNode.prototype.addBehaviorConduit = function addBehaviorConduit(bestApplication) {
    this.behaviorConduit = new BehaviorConduit(bestApplication, this);
};

BestNode.prototype.handleYield = function handleYield() {
    while (this.DOMNode.firstChild) {
        this.DOMNode.removeChild(this.DOMNode.firstChild);
    }
    while (this.childrenRoot.childNodes[0]) {
        this.DOMNode.appendChild(this.childrenRoot.childNodes[0]);
    }

    if (this.surrogateRoot.childNodes.length) {
        if (this.publicEvents[YIELD_KEY]) {
            this.eventManager.send(YIELD_KEY, this.surrogateRoot.childNodes);
        }
        else {
            YieldConduit.handleYield(this, this.surrogateRoot);
        }
    }
};

BestNode.prototype.initialize = function initialize() {
    this.stateManager.triggerGlobalChange(STATE_AUTOTRIGGER_RE);
};

BestNode.prototype.remove = function remove() {};

module.exports = BestNode;
