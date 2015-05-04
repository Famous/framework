BEST.module('arkady.pevzner:layouts:two-panel-layout', {
    behaviors: {
        '#left-panel' : {
            '$yield' : '.left-panel',
        },
        '#right-panel' : {
            '$yield' : '.right-panel',
            'align' : [1, 0]
        },
        '.panel' : {
            position: function(offsetX) {
                return [offsetX, 0];
            }
        }
    },
    events: {
        $public: {
            'display-left-panel' : function($state, $payload) {
                $state.set('offsetX', 0, {duration: 400, curve: 'outExpo'});

            },
            'display-right-panel' : function($state, $payload) {
                $state.set('offsetX', -$payload, {duration: 400, curve: 'outExpo'});
            }
        },
    },
    states: {
        offsetX: 0
    },
    tree: 'two-panel-layout.html',
})
.config({
    imports: {
        'famous:core': ['view']
    }
});
