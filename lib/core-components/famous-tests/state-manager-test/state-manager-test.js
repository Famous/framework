FamousFramework.scene('famous-tests:state-manager-test', {
    behaviors: {
        '#element': {
            'position': function(position) {
                return position;
            },
            'size': function(size) {
                return size;
            },
            'style': function(background) {
                return {
                    'background': background
                }
            }
        }
    },
    events: {
        '#element': {
            'click': function($state) {
                $state
                    .set('background', 'purple')
                    .thenSet('size', [400, 400], { duration: 1000, curve: 'outBack' })
                    .thenSet('position', [200, 200], { duration: 1000, curve: 'outBounce' });
            }
        }
    },
    states: {
        background: 'red',
        size: [250, 250],
        position: [0, 0]
    },
    tree: `
        <node id="element">
            <div>Click Here</div>
        </node>
    `
});