FamousFramework.scene('famous-tests:dispatcher:emit', {
    behaviors: {
        '#label' : {
            position: [100, 20],
            size: [600, 25],
            content: 'Click on square, $index/$repeatPayload should be logged from dispatched event.',
            style: {
                color: 'white',
                'font-family' : 'Lato'
            }
        },
        'child' : {
            '$repeat': function(count) {
                var result = [];
                for (var i = 0; i < count; i++) {
                    result.push({
                        content: 'Item ' + i,
                        position: [100 + i * 150, 100]
                    });
                }
                return result;
            }
        }
    },
    events: {
        'child' : {
            'custom-event' : function($payload, $index, $repeatPayload) {
                console.log($index, $repeatPayload);
            }
        }
    },
    states: {
        count: 5
    },
    tree: `
        <node id='label'></node>
        <child></child>
    `
})
.config({
    imports: {
        'famous-tests:dispatcher:emit': ['child']
    }
}); 