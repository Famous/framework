'use strict';

if (!window.Famous) {
    throw new Error('`Famous` library must be included before `BEST`');
}

var Application = require('./application');
var Bundle = require('./bundle');
var Evaluator = require('./evaluator');
var EventChannel = require('./event-channel');
var Famous = require('./famous');
var Finder = require('./finder');
var Graph = require('./graph');
var Injector = require('./injector');
var Loader = require('./loader');
var Messager = require('./messager');
var NodeStore = require('./node-store');
var BestNode = require('./node');
var StateManager = require('./state-manager');
var Widget = require('./widget');
var VirtualDOM = require('./virtual-dom');

module.exports = {
    Application: Application,
    Bundle: Bundle,
    Evaluator: Evaluator,
    EventChannel: EventChannel,
    Famous: Famous,
    Finder: Finder,
    Graph: Graph,
    Injector: Injector,
    Loader: Loader,
    Messager: Messager,
    NodeStore: NodeStore,
    Node: BestNode,
    StateManager: StateManager,
    Widget: Widget,
    VirtualDOM: VirtualDOM
};
