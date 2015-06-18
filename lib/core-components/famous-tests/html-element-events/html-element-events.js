FamousFramework.scene('famous-tests:html-element-events', {
    behaviors: {
        '.container': {
            'size': [200, 200],
            'align': [0.5, 0.5],
            'mount-point': [0.5, 0.5]
        }
    },
    events: {
        '.button': {
            'click': function($event) {
                console.log('$event: ', $event);
                // Actual behavior: above gets logged three times
                // Expected behavior: above gets logged once

                // Problem:
                //  Cannot read current target off of the stripped
                //  event returned from the Famous Engine.

                // Solution:
                //  We're discussing ways to fix this.
                //  In the meantime, wrap each html element
                //  in a node to attach events in this way.
            }
        }
    },
    states: {},
    tree: `
        <node class="container">
            <button class="button"> Button 1 </button>
            <button class="button"> Button 2 </button>
            <button class="button"> Button 3 </button>
        </node>
    `
});