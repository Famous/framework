FamousFramework.module('famous-tests:control-flow:basic-if', {
    behaviors: {
        '#button' : {
            position: [200, 50],
            size: [200, 50],
            style: {
                'border': '2px solid black',
                'background' : 'white',
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
            position: [200, 125],
        },
        '#square' : {
            style: {
                'background-color' : 'red',
                'border-radius': '0%' // Work around for bug in Engine (https://github.com/Famous/engine/issues/325)
            },
            position: [200, 350],
        },
        '.block' : {
            $if: function(toggle) {
                console.log('`$if`: ', toggle);
                return toggle;
            },
            style: {
                'border': '3px solid white'
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
    tree: 'basic-if.html'
});