'use strict';
var test = require('tape');
var IfController = require('./../lib/behavior-conduit/controllers/if');
var VirtualDOM = require('./../lib/virtual-dom')

test('BehaviorConduit `if` controller', function(t) {
    t.plan(3);
    t.ok(IfController, 'exports');
    t.ok(IfController.handle, 'exports handler');

    var dom = VirtualDOM.parse(
        '<a>' +
        '    <b/>' +
        '    <b>' +
        '        <c class="yay foo"></c>' +
        '        <c class="yay bar"></c>' +
        '        <c class="yay baz"></c>' +
        '    </b>' +
        '</a>'
    );
    IfController.handle('.foo', false, dom);
    t.equal(dom.outerHTML, '<body><a>    <b>    <b>                <c class="yay bar"></c>        <c class="yay baz"></c>    </b></b></a></body>');
});
