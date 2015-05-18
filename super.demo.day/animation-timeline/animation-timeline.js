BEST.scene('super.demo.day:animation-timeline', 'HEAD', {
    behaviors: {
        '.little-circle': {
            'size': [200, 200],
            'style': { 'border': '10px solid #f65314' }
        },
        '.medium-circle': {
            'size': [400, 400],
            'style': { 'border': '10px solid #00a1f1' }
        },
        '.large-circle': {
            'size': [600, 600],
            'style': { 'border': '10px solid #7cbb00' }
        },
        '.circle': {
            'origin': [0.5, 0.5],
            'align': [0.5, 0.5],
            'mount-point': [0.5, 0.5],
            'style': {
                'border-radius': '50%',
                'cursor': 'pointer'
            }
        }
    },
    events: {
        '.circle': {
            'click': function($timelines) {
                $timelines.get('pulse-animation').start({ duration: 1500 });
            } 
        }
    },
    states: {},
    tree: 'animation-timeline.html'
})
.timelines({
    'pulse-animation': {
        '.little-circle': {
            'size': {
                '0%':   { value: [200, 200], curve: 'outBack' },
                '25%':  { value: [400, 400], curve: 'outBack' },
                '50%':  { value: [200, 200] }
            }
        },
        '.medium-circle': {
            'size': {
                '0%':   { value: [400, 400], curve: 'outBack' },
                '50%':  { value: [600, 600], curve: 'outBack' },
                '75%':  { value: [400, 400] }
            }
        },
        '.large-circle': {
            'size': {
                '0%':   { value: [600, 600], curve: 'outBack' },
                '75%':  { value: [800, 800], curve: 'outBack' },
                '100%': { value: [600, 600] }
            }
        },
    }
});