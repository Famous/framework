BEST.scene('imtiaz.majeed:timeline:top-level-function', 'HEAD', {
    behaviors: {
        '#wrapper': {
            'align': [0.5, 0.5]
        },
        '#square': {
            'size': function(size) {
                return size;
            },
            'rotation-z': function(rotationZ) {
                return rotationZ;
            },
            'mount-point': [0.5, 0.5],
            'origin': [0.5, 0.5],
            'style': function() {
                return {
                    'background-color': 'red'
                }
            }
        }
    },
    events: {
        '$lifecycle': {
            'post-load': function($timelines) {
                $timelines.get('growAndShrink').start();
            }
        },
        '#square': {
            'ui-click': function($timelines) {
                $timelines.get('spinAround').start();
            }
        }
    },
    states: {
        size: [200, 200],
        rotationZ: 0
    },
    tree: 'top-level-function.html'
})
.timelines({
    'growAndShrink': {
        flexframes: {
            0:      { 'size': [[200, 200],  {curve: 'easeInOut'}] },
            '50%':  { 'size': [[400, 400],  {curve: 'easeInOut'}] },
            1000:   { 'size': [[200, 200]]  }
        }
    },
    'spinAround': {
        flexframes: {
            0:      { 'rotationZ': [0,          {curve: 'easeInOut'}] },
            '50%':  { 'rotationZ': [Math.PI/2,  {curve: 'easeInOut'}] },
            1000:   { 'rotationZ': [Math.PI*4]  }
        }
    }
});