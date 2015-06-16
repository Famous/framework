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
            'parent-size-change' : function($payload) {
                // Currently does not log due to bug with 'onParentSizeChange' event implementation in platform.
                console.log('Block parent size change: ', $payload);
            },
            'size-change' : function($state, $payload) {
                var sizeStr = '[ ' + Math.floor($payload[0]) + ' , ' + Math.floor($payload[1]) + ' ]';
                $state.set('sizeStr', sizeStr);
            }
        }
    },
    states: {},
    tree: 'size-change-event.html'
});
