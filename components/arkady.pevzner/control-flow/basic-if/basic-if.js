BEST.module('arkady.pevzner:control-flow:basic-if', {
    behaviors: {
        '#button' : {
            position: [200, 200],
            size: [200, 50],
            style: {
                'border': '2px solid black',
                'border-radius': '7px',
                'text-align': 'center',
                'line-height' : '50px',
                'cursor' : 'pointer'
            },
            'unselectable' : true,
        },
        '#circle' : {
            style: {
                'background-color' : 'blue',
                'border-radius': '50%'
            },
            position: [200, 275],
        },
        '#square' : {
            style: {
                'background-color' : 'red'
            },
            position: [200, 500],
        },
        '.block' : {
            $if: function(toggle) {
                console.log('`$if`: ', toggle);
                return toggle;
            },
            size: [200, 200]
        }
    },
    events: {
        '#button' : {
            'click' : function($state) {
                $state.set('toggle', !$state.get('toggle'));
            }
        }
    },
    states: {
        toggle: true
    },
    tree: 'basic-if.jade',
});