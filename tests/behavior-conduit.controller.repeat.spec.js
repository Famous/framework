'use strict';
var test = require('tape');
var RepeatController = require('./../lib/behavior-conduit/controllers/repeat');
var VirtualDOM = require('./../lib/virtual-dom')

test('BehaviorConduit `repeat` controller', function(t) {
    t.plan(3);
    t.ok(RepeatController, 'exports');
    t.ok(RepeatController.handle, 'exports handler');

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
    RepeatController.handle('.foo', [{a:1},{a:2},{a:3}], dom);
    t.equal(dom.outerHTML, '<body><a>    <b>    <b>                <c class="yay bar"></c>        <c class="yay baz"></c>    <c class="yay foo" data-messages="{&quot;a&quot;:1}"></c><c class="yay foo" data-messages="{&quot;a&quot;:2}"></c><c class="yay foo" data-messages="{&quot;a&quot;:3}"></c></b></b></a></body>');
});
