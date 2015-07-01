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
            'size': function(boxSize) {
                return [boxSize, boxSize];
            },
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
                $state.set('numberOfClicks', $state.get('incrementPerClick') + $state.get('numberOfClicks'));
                $state.set('angle', $state.get('angle') + $state.get('rotationPerClick'), {
                    duration: $state.get('rotationDuration'),
                    curve: $state.get('rotationCurve')
                });
            }
        }
    },
    states: {
        numberOfClicks: 0,
        angle: 0,
        rotationPerClick: Math.PI / 2,
        rotationDuration: 1500,
        rotationCurve: 'outBounce',
        incrementPerClick: 1,
        boxSize: 400
    },
    tree: `
        <node id="background">
            <node id="square"></node>
        </node>
    `
})
.config({
    expose: [
        { key: 'rotationCurve', name: 'Rotation Curve' },
        { key: 'rotationPerClick', name: 'Rotation Per Click', range: [0, Math.PI * 2], step: 0.1 },
        { key: 'rotationDuration', name: 'Rotation Duration', range: [0, 5000] },
        { key: 'incrementPerClick', name: 'Increment Per Click', range: [0, 10], type: 'int' },
        { key: 'boxSize', name: 'Box Size', range: [0, 1000] },
    ]
});
