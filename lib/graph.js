'use strict';

var Famous = require('./famous');
var BestNode = require('./node');
var VirtualDOM = require('./virtual-dom');

function Graph(name, selector) {
    this.famousContext = Famous.createContext(selector);
    this.famousRoot = this.famousContext.addChild();
    this.virtualDOM = VirtualDOM.create(name);
    this.rootNode = new BestNode(this.virtualDOM);
    this.rootNode.prepare(this.famousRoot);
}

module.exports = Graph;
