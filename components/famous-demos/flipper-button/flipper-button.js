BEST.component('famous-demos:flipper', {
    tree: 'flipper.html',
    behaviors: {
        '#flipper-root': {
            'mount-point': [.5,.5],
            'align': [0.5, 0.5],
            'origin': [0.5, 0.5],
            'size': function(size) {
              return [size[0], size[1]];
            },
            'rotation-x': function(rotationX) {
                return rotationX;
            }
        },
        '.flipper-back': {
            'rotation-x': function() {
                return Math.PI;
            }
        },
        '.front-surface': {
            'style': {
                'background-color': 'rgb(244, 67, 54)',
                'color': 'rgb(255,255,255)',
                'font-size' : '20px',
                'line-height': '85px',
                'cursor': 'pointer'
            }
        },
        '.back-surface': {
            'style':  {
                'background-color': 'rgb(238, 238, 238)',
                'font-size' : '20px',
                'font-weight': 'bold',
                'color': 'rgb(244, 67, 54)'
            }
        },
        '.button-surface' : {
            'backface-visible': false,
            'box-shadow': '0px 10px 25px -10px rgba(0,0,0,0.75)',
            'unselectable': true,
            style: {
                'font-family' : 'Arial',
                'text-align': 'center',
                'border-radius': '5%'
            }
        },
    },
    events: {
        public: {
            'flip-click': function(state) {
                var rotation = state.get('rotationX') > 0 ? 0 : Math.PI;
                state.set('rotationX', rotation, {duration: 400, 'curve': 'outExpo'});
            }
        }
    },
    states: {
        size: [200, 80],
        zPos: { front: 1, back: 0 },
        rotationX: 0
    }
});
