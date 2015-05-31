BEST.module('famous:demos:flipper-button', {
    tree: 'flipper-button.html',
    behaviors: {
        '.flipper-container': {
            'size': '[[setter]]',
            'align': [0.5, 0.5],
            'origin': [0.5, 0.5],
            'mount-point': [0.5, 0.5],
            'rotation-x': '[[setter|camel]]',
            'scale': function(scale) {
                return [scale, scale, 1];
            }
        },
        '.button': {
            'backface-visible': false,
            'box-shadow': '0px 10px 25px -10px rgba(0,0,0,0.75)',
            'unselectable': true,
            'style': {
                'font-family' : 'Arial',
                'text-align': 'center',
                'border-radius': '20px',
                'cursor': 'pointer'
            }
        },
        '.front': {
            'style': { 
                'background': 'rgb(244, 67, 54)',
                'color': 'rgb(255,255,255)',
                'font-size': '24px',
                'font-weight': 'bold',
                'line-height': '85px'
            }
        },
        '.back': {
            'position-z': -1,
            'origin': [0.5, 0.5],
            'rotation-x': Math.PI,
            'style' : {
                'font-size': '24px',
                'font-weight': 'bold',
                'line-height': '35px',
                'color': 'rgb(244, 67, 54)',
                'background': 'rgb(238, 238, 238)',
            }
        }
    },
    events: {
        '.button': {
            'click': function($state) {
                var rotation = $state.get('rotationX') > 0 ? 0 : Math.PI;

                $state
                    .set('rotationX', rotation, { duration: 500, curve: 'outExpo' })
                    .set('scale',     0.8,      { duration: 150, curve: 'inCirc'  })
                    .thenSet('scale', 1,        { duration: 250, curve: 'outBack' });
            }
        }
    },
    states: {
        scale: 1,
        rotationX: 0,
        size: [200, 80]
    }
});