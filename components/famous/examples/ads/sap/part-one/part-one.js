BEST.component('famous:examples:ads:sap:part-one', {
    tree: 'part-one.html',
    behaviors: {
        '#part-one-container': {
            'position': function(containerPosition) {
                return containerPosition;
            }
        },
        '#complexity-container': {
            'position': function(time, complexityPosition) {
                return $B.timeline([
                    [0,     complexityPosition],
                    [500,   complexityPosition, 'easeOut'],
                    [1000,  [0, 110]],
                    [2000,  [0, 110], 'easeOut'],
                    [2500,  [-300, 110]]
                ])(time);
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
            'position': function(time, hopesPosition) {
                return $B.timeline([
                    [0,     hopesPosition],
                    [2000,  hopesPosition, 'easeOut'],
                    [2500,  [0, 110]]
                ])(time);
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
            'start-one' : function(state, message) {
                if (!state.get('animationStarted') && message === 1) {
                    state.set('time', 2500, {duration: 2500});
                    state.set('animationStarted', true);
                }
            }
        }
    },
    states: {
        containerPosition: [0, 0],
        complexityPosition: [300, 110],
        hopesPosition: [300, 110],
        time: 0,
        animationStarted: false
    }
});
