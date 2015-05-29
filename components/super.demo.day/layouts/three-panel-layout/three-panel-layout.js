BEST.module('super.demo.day:layouts:three-panel-layout', 'HEAD', {
    behaviors: {
        '#panel-1' : {
            // See <header-footer> for discussion of '$yield'
            $yield: '.panel-1',
            position: function(offset) {
                return [offset, 0];
            }
        },
        '#panel-2' : {
            $yield: '.panel-2',
            position: function(panelWidth, offset) {
                return [offset + panelWidth, 0];
            }
        },
        '#panel-3' : {
            $yield: '.panel-3',
            position: function(panelWidth, offset) {
                return [offset + panelWidth * 2, 0];
            }
        }
    },
    events: {
        $public: {
            'display-panel-one' : function($state, $payload) {
                $state.set('offset', 0, $state.get('curve'));
            },
            'display-panel-two' : function($state, $payload) {
                $state.set('offset', -$state.get('panelWidth'), $state.get('curve'));
            },
            'display-panel-three' : function($state, $payload) {
                $state.set('offset', -2 * $state.get('panelWidth'), $state.get('curve'));
            },
            'curve' : '[[setter]]',
            'panel-width' : '[[setter|camel]]'
        },
    },
    states: {
        offset: 0,
        panelWidth: 0,
        curve: {duration: 400, curve: 'outExpo'}
    },
    tree: 'three-panel-layout.jade',
});
