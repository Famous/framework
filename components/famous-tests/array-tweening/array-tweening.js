FamousFramework.scene('famous-tests:array-tweening', {
    behaviors: {
        '#square': {
            'position': '[[identity|position]]',
            'size': [200, 200],
            'style': {
                'background': 'red',
                'color': 'white',
                'font-family': 'Lato'
            }
        }
    },
    events: {
        '#square': {
            'click': function($state) {
                if ($state.get('position')[0] > 200) {
                    $state.set('position', [0, 0], {
                        duration: 500,
                        curve: 'outBack'
                    });
                }
                else {
                    $state.set('position', [400, 400], {
                        duration: 500,
                        curve: 'outBack'
                    });
                }
            }
        }
    },
    states: {
        position: [0, 0]
    },
    tree: `
        <node id="square">
            <div>Click here to see example of tweening array values!</div>
        </node>
    `
});