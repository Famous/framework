BEST.component('famous-ads:sap-part-one', {
    tree: 'sap-part-one.html',
    behaviors: {
        '#part-one-container': {
            'position': function(containerPosition) {
                return containerPosition;
            }
        },
        '#complexity-container': {
            'position': function(complexityPosition) {
                return complexityPosition;
            }
        },
        '#complexity': {
            'style': {
                'color': 'white',
                'font-size': '40px',
                'font-weight': 'bold',
                'text-align': 'center'
            }
        },
        '#hopes-container': {
            'position': function(hopesPosition) {
                return hopesPosition;
            }
        },
        '#hopes': {
            'style': {
                'color': 'white',
                'font-size': '22px',
                'font-weight': 'bold',
                'text-align': 'center'
            }
        },
    },
    events: {
        public: {
            'start': function(state, message) {
                state.set('_wait', -1, {duration: 500}, function() {
                    state.set('complexityPosition', [0, 110], {duration: 500, curve: 'easeOut'}, function() {
                        state.set('_wait', -1, {duration: 2000}, function() {
                            state.set('complexityPosition', [-300, 110], {duration: 500, curve: 'easeOut'});
                            state.set('hopesPosition', [0, 110], {duration: 500, curve: 'easeOut'});
                        });
                    });
                });
                
            }
        }
    },
    states: {
        containerPosition: [0, 0],
        complexityPosition: [300, 110],
        hopesPosition: [300, 110],
        _wait: -1
    }
});
