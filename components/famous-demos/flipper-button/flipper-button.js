BEST.component('famous-demos:flipper-button', {
    tree: 'flipper-button.html',
    behaviors: {
        '#flipper-root': {
            'origin': [0.5, 0.5],
            'size': function(size) {
              return [size[0], size[1]];
            },
            'rotation-x': function(rotationX) {
                return rotationX;
            },
            'scale': function(scale) {
                return [scale, scale, 1];
            }
        },
        '.flipper-back': {
            'rotation-x': function() {
                return Math.PI;
            }
        },
        '.front-label' : {
            '$yield' : '.front-label'
        },
        '.back-label' : {
            '$yield' : '.back-label'
        },
        '.button-surface' : {
            'backface-visible': false,
            'box-shadow': '0px 10px 25px -10px rgba(0,0,0,0.75)',
            'unselectable': true,
            style: {
                'font-family' : 'Arial',
                'text-align': 'center',
                'border-radius': '5%',
                'cursor': 'pointer'
            }
        },
        '.front-surface': {
            'style': {
                'background-color': 'rgb(244, 67, 54)',
            }
        },
        '.front-label-surface' : {
            'style' : {
                'color': 'rgb(255,255,255)',
                'font-size' : '20px',
                'line-height': '85px',
                'pointer-events': 'none'
            }
        },
        '.back-label-surface': {
            'style' : {
                'background-color': 'rgb(238, 238, 238)',
                'font-size' : '20px',
                'font-weight': 'bold',
                'color': 'rgb(244, 67, 54)',
            }
        }
    },
    events: {
        public: {
            'flip-click': function(state, event) {
                var rotation = state.get('rotationX') > 0 ? 0 : Math.PI;
                state.set('rotationX', rotation, {duration: 500, 'curve': 'outExpo'});
                window.state = state;
                state.set('scale', 0.8, {duration: 150, 'curve': 'inCirc'}, function(state){

                    // Hack --> Bug with implentation of Transitionable in StateManager
                    setTimeout(function() {
                        state.set('scale', 1, {duration: 250, curve: 'outBack'});
                    }, 1);
                }.bind(null, state));
            }
        }
    },
    states: {
        size: [200, 80],
        zPos: { front: 1, back: 0 },
        rotationX: 0,
        scale: 1
    }
});
