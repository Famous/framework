'use strict';
var test = require('tape');
var PruneTree = require('../lib/helpers/prune-tree');
var VirtualDOM = require('../lib/virtual-dom');

var domNode = VirtualDOM.parse(
    '<a root="a">' +
    '    <b root="b">' +
    '        <c root="a">' +
    '           <d root="a"></d>' +
    '           <d root="a">' +
    '                <x>' +
    '                    <x>' +
    '                        <x>' +
    '                            <f root="a"></f>' +
    '                        </x>' +
    '                    </x>' +
    '                </x>' +
    '            </d>' +
    '           <e root="e"></e>' +
    '        </c>' +
    '    </b>' +
    '</a>'
).children[0];
domNode.parentNode.removeChild(domNode);


test('Prune Tree', function(t) {
    t.plan(5);
    t.ok(PruneTree, 'exports');
    t.ok(PruneTree.pruneByAttribute, 'exports function');

    var aNodes;
    var bNodes;
    var cNodes;
    var dNodes;
    var eNodes;
    var fNodes;
    var xNodes;

    var correctInitialState = true;
    bNodes = domNode.querySelectorAll('b');
    if (correctInitialState) correctInitialState = bNodes.length === 1;
    cNodes = domNode.querySelectorAll('c');
    if (correctInitialState) correctInitialState = cNodes.length === 1;
    dNodes = domNode.querySelectorAll('d');
    if (correctInitialState) correctInitialState = dNodes.length === 2;
    eNodes = domNode.querySelectorAll('e');
    if (correctInitialState) correctInitialState = eNodes.length === 1;
    fNodes = domNode.querySelectorAll('f');
    if (correctInitialState) correctInitialState = fNodes.length === 1;
    xNodes = domNode.querySelectorAll('x');
    if (correctInitialState) correctInitialState = xNodes.length === 3;
    t.ok(correctInitialState, 'domNode correctly initialized');

    PruneTree.pruneByAttribute(domNode, 'root', 'a');

    // Check removed nodes
    var removedState = true;
    bNodes = domNode.querySelectorAll('b');
    removedState = bNodes.length === 0;
    eNodes = domNode.querySelectorAll('e');
    if (removedState) eNodes.length === 0;
    xNodes = domNode.querySelectorAll('x');
    if (correctInitialState) correctInitialState = xNodes.length === 0;
    t.ok(removedState, 'correctly removes nodes');

    // Check remaining nodes
    var unprunedState = true;
    cNodes = domNode.querySelectorAll('c');
    if (unprunedState) unprunedState = cNodes.length === 1;
    dNodes = domNode.querySelectorAll('d');
    if (unprunedState) unprunedState = dNodes.length === 2;
    fNodes = domNode.querySelectorAll('f');
    if (unprunedState) unprunedState = fNodes.length === 1;
    t.ok(unprunedState, 'correctly leaves nodes w/ matching attribute');
});
