BEST.component('famous-demos:flipper', {
    tree: 'flipper.html',
    behaviors: {
        '#flipper-root': {
            'mount-point': [.5,.5],
            'align': [0.5, 0.5],
            'origin': [0.5, 0.5],
            'size': function(size) {
              return [size[0], size[1]];
            }
        },
        '.flipper-front': {
            'position-z': function(zPos) {
                return zPos.front;
            }
        },
        '.front-surface': {
            'style': {
                'background-color': 'rgb(244, 67, 54)',
                'color': 'rgb(255,255,255)',
                'text-align': 'center',
                'line-height': '85px'
            },
            'unselectable': true,
            'backface-visible': false
        },
        '.flipper-back': {
            'position-z': function(zPos) {
                return zPos.back;
            },
            'rotation-y': function(zPos) {
                if(zPos.back === 1) {
                    return 0;
                }
                return Math.PI;
            }
        },
        '.back-surface': {
            'style':  {
                'background-color': 'rgb(238, 238, 238)'
            },
            'unselectable': true,
            'backface-visible': false
        }
    },
    events: {
        public: {
            'flip-click': function(state) {
                var zpos = state.get('zPos');

                if(zpos && zpos.front === 1) {
                    zpos = { front: 0, back: 1 }
                } else {
                    zpos = { front: 1, back: 0 }
                }

                state.set('zPos', zpos);
            }
        }
    },
    states: {
        size: [200, 80],
        zPos: { front: 1, back: 0 }
    }
});
