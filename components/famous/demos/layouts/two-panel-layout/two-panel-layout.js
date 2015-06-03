BEST.module('famous:demos:layouts:two-panel-layout', {
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
                $state.set('offsetX', 0, $state.get('curve'));

            },
            'display-right-panel' : function($state, $payload) {
                $state.set('offsetX', -$payload, $state.get('curve'));
            },
            'curve' : '[[setter]]'
        },
    },
    states: {
        offsetX: 0,
        curve: {duration: 400, curve: 'outExpo'}
    },
    tree: 'two-panel-layout.html',
})
.config({
    imports: {
        'famous:core': ['view']
    }
});
