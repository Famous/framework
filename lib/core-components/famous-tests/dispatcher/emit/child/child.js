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
            'click' : function($dispatcher, $event, $payload, $repeatPayload, $index) {
                console.log('Click Event from child:');
                console.log('event: ', $event);
                console.log('payload: ', $payload);
                console.log('$index: ', $index);
                console.log('$repeatPayload: ', $repeatPayload);
                console.log('----------------------------');
                $dispatcher.emit('custom-event', {payload: 'payload'});
            }
        }
    },
    states: {
    },
    tree: `
    `
});
