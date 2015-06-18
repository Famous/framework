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