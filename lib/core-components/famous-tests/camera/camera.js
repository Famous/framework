var angle = Math.PI / 5;

FamousFramework.scene('famous-tests:camera', {
    behaviors: {
        '$camera': {
            'depth': '[[identity]]'
        },
        '$self': {
            'unselectable': true
        },
        '#output': {
            'align': [0.5, 0, 0.5],
            'mount-point': [0.5, 0, 0.5],
            'content': function(depth) {
                return 'current camera depth: ' + depth;
            },
            'size-absolute': [300, 80],
            'style': {
                background: 'rgba(255, 0, 153, 0.5)',
                border: '3px solid #ffffff',
                color: '#ffffff',
                'line-height': '80px',
                'text-align': 'center'
            }
        },
        '#outer': {
            'align': [0.5, 0.5, 0.5],
            'mount-point': [0.5, 0.5, 0.5],
            'origin': [0.5, 0.5, 0.5],
            'rotation': [-angle/2, angle, 0],
            'position': [0, 0, -500],
            'size-absolute': [800, 600],
            'style': {
                background: 'rgba(255, 0, 153, 0.3)',
                border: '5px solid #ffffff',
                color: '#ffffff',
                'text-align': 'center'
            }
        },
        '#middle': {
            'align': [0.5, 0.5, 0.5],
            'mount-point': [0.5, 0.5, 0.5],
            'origin': [0.5, 0.5, 0.5],
            'rotation': [0, -angle, 0],
            'position': [0, 0, -200],
            'size-absolute': [600, 450],
            'style': {
                background: 'rgba(255, 0, 153, 0.5)',
                border: '5px solid #ffffff',
                color: '#ffffff',
                'text-align': 'center'
            }
        },
        '#inner': {
            'align': [0.5, 0.5, 0.5],
            'mount-point': [0.5, 0.5, 0.5],
            'origin': [0.5, 0.5, 0.5],
            'rotation': [0, -angle, 0],
            'position': [0, 0, 300],
            'size-absolute': [450, 250],
            'style': {
                background: 'rgba(255, 0, 153, 1.0)',
                border: '5px solid #ffffff',
                color: '#ffffff',
                'text-align': 'center'
            }
        }
    },
    events: {
        '$self': {
            'click': function($state) {
                var newDepth = Math.floor(Math.random() * 2000) + 200;
                $state.set('depth', newDepth);
            }
        }
    },
    states: {
        depth: 400
    },
    tree: 'camera.html'
})
.config({
    imports: {
        'famous-tests:camera': ['custom']
    }
});
