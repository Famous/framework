BEST.module('arkady.pevzner:timeline-example', {
    behaviors: {
        '#ui-el' : {
            size: [100, 100],
            style:  function(myStyle) {
                return myStyle;
            },
            position: function(myTimeline, time) {
                return BEST.helpers.piecewise(myTimeline)(time);
            }
        }
    },
    events: {
        '#ui-el' : {
            'famous:events:click' : function($state) {
                $state.set('time', 2000, {duration: 2000});
            }
        }
    },
    states: {
        time: 0,
        myTimeline: [
            [0, [100, 100], 'outExo'],
            [500, [600, 100], 'inExpo'],
            [1000, [600, 600], 'inOutBack'],
            [2000, [100, 100]]
        ],
        myStyle : {
            'background-color' : 'black',
            'text-align' : 'center',
            'line-height' : '100px',
            'color' : 'white',
            'cursor' : 'pointer'
        }
    },
    tree: 'timeline-example.html',
})
.config({
    imports: {
        'famous:core': ['ui-element']
    }
});
