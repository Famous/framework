FamousFramework.scene('famous-tests:dispatcher:emit:child', {
    behaviors: {
        '$self' : {
            'size' : [100, 100],
            'style': {
                'background-color' : 'white',
                'cursor' : 'pointer'
            }
        }
    },
    events: {
        '$self' : {
            'click' : function($dispatcher) {
                $dispatcher.emit('custom-event', {payload: 'payload'});
            }
        }
    },
    states: {
    },
    tree: `
    `
});
