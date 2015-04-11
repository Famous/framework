'use strict';
var test = require('tape');
var Application = require('../../lib/application');
var GenerateDiv = require('../helpers/generate-div');
var VirtualDOM = require('../../lib/virtual-dom');
var NodeStore = require('../../lib/node-store');

test('Integration: Messaging', function(t) {
    t.plan(10);

    t.ok(Application, 'Appliction exports');
    var container = GenerateDiv.create();
    var selector =  '#' + container.id;
    t.ok(container, 'container created');
    t.ok(document.body.querySelectorAll(selector), 'container attached to body');

    Application.deploy('famous:tests:messaging', selector, null, function(app){
        t.ok(app, 'Application deploys');

        var bestNode = app.graph.rootNode;
        t.equals(bestNode.stateManager.get('message'), null, 'initial state');
        var message = "update";
        app.send('$root', 'send-message', message);
        t.equals(bestNode.stateManager.get('message'), message, 'app sends messages w/ $root');

        var elementVirtualDom = app.graph.rootNode.domNode.querySelector('#element');
        t.ok(elementVirtualDom, 'famous:core:dom-element targeted');
        var elementBestNode = NodeStore.findNode(VirtualDOM.getUID(elementVirtualDom));
        t.ok(elementBestNode, 'famous:core:dom-element best node found');
        var initialStyle = elementBestNode.stateManager.get('style');
        t.equals(initialStyle.border, '1px solid black', 'initial state on sub element');
        var newBorder = '3px solid black';
        app.send('#element', 'style', {border: newBorder});
        t.equals(elementBestNode.stateManager.get('style').border, newBorder, 'app sends messages w/ css selector');
    });
});
