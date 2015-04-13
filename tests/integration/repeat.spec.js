'use strict';
var test = require('tape');
var Application = require('../../lib/application');
var GenerateDiv = require('../helpers/generate-div');
var VirtualDOM = require('../../lib/virtual-dom');
var NodeStore = require('../../lib/node-store');

var INITIAL_COUNT = 3;
var INCREASED_COUNT = 6;
var DECREASED_COUNT = 1;

test('Integration: Repeat', function(t) {
    t.plan(10);

    t.ok(Application, 'Appliction exports');
    var container = GenerateDiv.create();
    var selector =  '#' + container.id;
    t.ok(container, 'container created');
    t.ok(document.body.querySelectorAll(selector), 'container attached to body');

    Application.deploy('famous:tests:repeat-element', selector, null, function(app){
        t.ok(app, 'Application deploys');

        var node = app.graph.rootNode;
        var virtualDOM = node.domNode; 

        t.equals(node.stateManager.get('count'), INITIAL_COUNT, 'initial count set');
        t.equals(virtualDOM.querySelectorAll('#view').length, INITIAL_COUNT, 'inital count reflected in VirtualDOM');

        app.send('$root', 'update-count', INCREASED_COUNT);
        t.equals(node.stateManager.get('count'), INCREASED_COUNT, 'count increased');
        t.equals(virtualDOM.querySelectorAll('#view').length, INCREASED_COUNT, 'increase reflected in VirtualDOM');

        app.send('$root', 'update-count', DECREASED_COUNT);
        t.equals(node.stateManager.get('count'), DECREASED_COUNT, 'count decreased');
        t.equals(virtualDOM.querySelectorAll('#view').length, DECREASED_COUNT, 'decrease reflected in VirtualDOM');
    });
});
