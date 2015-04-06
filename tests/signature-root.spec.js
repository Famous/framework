'use strict';
var test = require('tape');
var BEST = require('../lib/index');
var VirtualDOM = require('../lib/virtual-dom');
var NodeStore = require('../lib/node-store');

var SQUARE_ELEMENT_SELECTOR = '#square-element';
var SQUARE_BACKGROUND_COLOR = 'gray';
var LABEL_SELECTOR = '#label-element';
var LABEL_OVERWRITE = '<div>Yielded Label (Square below should be gray)</div>';

test('Signature Root', function(t) {
    t.plan(2);


    /*
        test:yield-label is basic component w/ two views and two html-elements.
        The component sets the 'background-color' style on the '#square-element' famous:html-element
        to 'gray'. It also sets '$yield: true' on '#label-view'.
     */
    t.test('Component properly defines its own state', function(st){
        st.plan(1);

        BEST.Application.deploy('famous:tests:yield-label', 'body', function(app) {
            var bestNode = app.graph.rootNode;
            var rootDOMNode = bestNode.domNode;
            var squareDOMNode = rootDOMNode.querySelector(SQUARE_ELEMENT_SELECTOR);
            var squareUID = VirtualDOM.getUID(squareDOMNode);
            var squareBestNode = NodeStore.findNode(squareUID);
            var squareStyle = squareBestNode.stateManager.get('style');
            st.equals(squareStyle['background-color'], SQUARE_BACKGROUND_COLOR, 'component defined its own background color')
        });
    });

    /*
        test:signature-root-check is a component that has its own label via famous:view/famous:html-element.
        It also includes famous:yield-label, and injects its custom label (<div>Yielded Label (Square below should be gray)</div>)
        into famous:yield-label via famous:yield-label's $yield behavior.
        It also attempts to set the color of the square in famous:yield-label to red, which it sohuld not be able to do
        because that element is not defined inside its own tree.
     */
    t.test('Component cannot define state outside of its visible children', function(st){
        st.plan(2);

        BEST.Application.deploy('famous:tests:signature-root-check', 'body', function(app) {
            var bestNode = app.graph.rootNode;
            var rootDOMNode = bestNode.domNode;

            var labelDOMNode = rootDOMNode.querySelector(LABEL_SELECTOR);
            var labelUID = VirtualDOM.getUID(labelDOMNode);
            var labelBestNode = NodeStore.findNode(labelUID);
            var labelContent = labelBestNode.stateManager.get('content');
            st.equals(labelContent, LABEL_OVERWRITE, 'component properly overwrote label via $yield');


            var squareDOMNode = rootDOMNode.querySelector(SQUARE_ELEMENT_SELECTOR);
            var squareUID = VirtualDOM.getUID(squareDOMNode);
            var squareBestNode = NodeStore.findNode(squareUID);
            var squareStyle = squareBestNode.stateManager.get('style');
            st.equals(squareStyle['background-color'], SQUARE_BACKGROUND_COLOR, 'component did not overwrite background color');
        });
    });
});
