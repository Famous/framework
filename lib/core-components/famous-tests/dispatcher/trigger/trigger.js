FamousFramework.scene('famous-tests:dispatcher:trigger', {
    behaviors: {
        '#element': {
            'align': [0.5, 0.5],
            'mount-point': [0.5, 0.5],
            'origin': [0.5, 0.5],
            'size': function(elementSize) {
                return elementSize;
            },
            'style': { 'background': 'purple' }
        }
    },
    events: {
        '$public': {
            'change': function($state, $payload) {
                console.log('change triggered!');
            }
        },
        '#element': {
            'click': function($state, $dispatcher) {
                console.log('clicked')
                $state.set('elementSize', [400, 400]);
                $dispatcher.trigger('change', $state.get('elementSize'));
            }
        }
    },
    states: {
        elementSize: [200, 200]
    },
    tree: `
        <node id="element"><div>Click here!</div></node>
    `
});