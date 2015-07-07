FamousFramework.scene('famous-tests:dispatcher:broadcasting', {
    behaviors: {
        '#parent': {
            'size': [window.innerWidth, window.innerHeight]
        }
    },
    events: {
        '#parent': {
            'click': function($dispatcher) {
                $dispatcher.broadcast('child-size', [600, 600]);
            }
        }
    },
    states: {},
    tree: `
        <node id="parent">
            <child id="child"></child>
        </node>
    `
})
.config({
    imports: {
        'famous-tests:dispatcher:broadcasting': ['child']
    }
});