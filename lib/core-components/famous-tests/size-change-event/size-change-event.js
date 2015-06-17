FamousFramework.module('famous-tests:size-change-event', {
    behaviors: {
        '#container' : {
            'size-proportional': [0.5, 0.5],
            'position' : [0, 50],
            'style': {
                'background-color' : 'gray',
                'padding' : '20px',
                'font-size' : '20px'
            },
            'content' : '[[identity|sizeStr]]'
        }
    },
    events: {
        '#container' : {
            'parent-size-change' : function($event) {
                console.log('Parent size change: ', $event);
            },
            'size-change' : function($state, $event) {
                var sizeStr = '[ ' + Math.floor($event.value[0]) + ' , ' + Math.floor($event.value[1]) + ' ]';
                $state.set('sizeStr', sizeStr);
            }
        }
    },
    states: {},
    tree: 'size-change-event.html'
});
