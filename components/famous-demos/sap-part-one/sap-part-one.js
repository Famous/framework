BEST.component('famous-demos:sap-part-one', {
    tree: 'sap-part-one.html',
    behaviors: {
        '#part-one-container': {
            'position': function(containerPosition) {
                return containerPosition;
            },
            '$yield': true
        },
        '#complexity-container': {
            'position': function(complexityPosition) {
                return complexityPosition;
            },
        '$yield': true
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
            },
            '$yield': true
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
            'part-one-container': function(state, message) {
                state.set('containerPosition', message.state, message.transition)
            },
            'complexity-position': function(state, message) {
                state.set('complexityPosition', message.state, message.transition);
            },
            'hopes-position': function(state, message) {
                state.set('hopesPosition', message.state, message.transition);
            }
        }
    },
    states: {
        containerPosition: [0, 0],
        complexityPosition: [300, 110],
        hopesPosition: [300, 110]
    }
});
