FamousFramework.scene('famous-demos:clickable-square', {
    behaviors: {
        '#background': {
            'style': {
                'background-color': '#444'
            }
        },
        '#square': {
            'align': [0.5, 0.5],
            'origin': [0.5, 0.5],
            'mount-point': [0.5, 0.5],
            'size': [400, 400],
            'content': function(numberOfClicks) {
                return `<div>${numberOfClicks}</div>`;
            },
            'rotation-z': function(angle) {
                // console.log(angle);
                return angle;
            },
            'style': {
                'color': '#7099EE',
                'background': '#222222',
                'border': '6px solid #333333',
                'text-align': 'center',
                'font-size': '60px',
                'font-family': '"Lato", Helvetica, Arial, sans-serif',
                'cursor': 'pointer'
            },
            'unselectable': true
        }
    },
    events: {
        '#square': {
            'click': function($state) {
                $state.set('numberOfClicks', 1 + $state.get('numberOfClicks'));
                $state.set('angle', $state.get('angle') + Math.PI / 2, {
                    duration: 1500,
                    curve: 'outBounce'
                });
            }
        }
    },
    states: {
        numberOfClicks: 0,
        angle: 0
    },
    tree: `
        <node id="background">
            <node id="square"></node>
        </node>
    `
});
