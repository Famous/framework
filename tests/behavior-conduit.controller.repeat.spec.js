'use strict';
var test = require('tape');
var RepeatController = require('./../lib/behavior-conduit/controllers/repeat');
var VirtualDOM = require('./../lib/virtual-dom');
var BEST = require('../lib/index');

var INITIAL_REPEAT_ELEMENT_COUNT = 3;

test('BehaviorConduit `repeat` controller', function(t) {
    t.plan(2);

    t.test('repeat controller works on VirtualDOM', function(st){
        st.plan(3);
        st.ok(RepeatController, 'exports');
        st.ok(RepeatController.handle, 'exports handler');

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
        st.equal(dom.outerHTML, '<body><a>    <b>    <b>                <c class="yay bar"></c>        <c class="yay baz"></c>    <c class="yay foo" data-messages="{&quot;a&quot;:1}"></c><c class="yay foo" data-messages="{&quot;a&quot;:2}"></c><c class="yay foo" data-messages="{&quot;a&quot;:3}"></c></b></b></a></body>');
    })

    t.test('repeat behavior works with BEST components', function(st) {
        st.end();

        // st.plan(5);

        // BEST.Application.deploy('test:repeat-element', 'body', function(app) {
        //     var faSurfaceCount;
        //     var virtualDOMChildCount;

        //     faSurfaceCount = document.body.querySelectorAll('.fa-surface').length;
        //     virtualDOMChildCount = app.graph.virtualDOM.childNodes.length;
        //     st.equal(faSurfaceCount, INITIAL_REPEAT_ELEMENT_COUNT, 'initially creates fa-surfaces');
        //     st.equal(virtualDOMChildCount, INITIAL_REPEAT_ELEMENT_COUNT, 'initially creates children in virtualDOM');

        //     app.send('$root', 'update-count', 6);
        //     faSurfaceCount = document.body.querySelectorAll('.fa-surface').length;
        //     virtualDOMChildCount = app.graph.virtualDOM.childNodes.length;
        //     st.equal(faSurfaceCount, INITIAL_REPEAT_ELEMENT_COUNT, 'increases amount of fa-surfaces');
        //     st.equal(virtualDOMChildCount, INITIAL_REPEAT_ELEMENT_COUNT, 'increases amount of children in virtualDOM');

        //     app.send('$root', 'update-count', 1);
        //     // Note: No check for fa-surface count b/c Famo.us keeps pool of divs so they aren't removed
        //     virtualDOMChildCount = app.graph.virtualDOM.childNodes.length;
        //     st.equal(virtualDOMChildCount, INITIAL_REPEAT_ELEMENT_COUNT, 'decreases amount of children in virtualDOM');
        // });
    });
});
