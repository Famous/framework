BEST.component('famous-ads:sap-ad', {
    tree: 'sap-ad.html',
    behaviors: {
        '#ad-container': {
            'size': function(adSize) {
                return adSize;
            },
        },
        '#part-one-container': {
            'position': function(partOnePosition) {
                return partOnePosition;
            },
        },
        '#part-one-component': {
            'start': function(_partOneStart) {
                return _partOneStart;
            }
        },
        '#part-two-container': {
            'position': function(partTwoPosition) {
                return partTwoPosition;
            }
        },
        '#part-two-component': {
            'start': function(_partTwoStart) {
                return _partTwoStart;
            }
        },
        '#start-button-container': {
            'position': function(startButtonPosition) {
                return startButtonPosition;
            },
            'size': function(startButtonSize) {
                return startButtonSize;
            }
        },
        '#start-button': {
            'style': {
                'cursor': 'pointer',
                'background-color': '#666',
                'color': 'whitesmoke',
                'font-weight': 'bold',
                'font-size': '18px',
                'text-align': 'center'
            },
            'unselectable': true
        } 
    },
    events: {
        public: {
            'start-ad': function(state, event) {
                state.set('_partOneStart', 'started');
                setTimeout(function() {
                    state.set('partOnePosition', [-150, 0, 0], {duration: 500, curve: 'easeOut'});
                    state.set('partTwoPosition', [0, 0, 0], {duration: 500, curve: 'easeOut'}, function() {
                        state.set('_partTwoStart', 'started');
                    });
                }, 5500);
            }
        }
    },
    states: {
        adSize: [300, 600],
        partOnePosition: [0, 0, 0],
        partTwoPosition: [150, 0, 0],
        startButtonPosition: [0, 600, 0],
        startButtonSize: [80, 30],
        _partOneStart: '',
        _partTwoStart: ''
    }
});
