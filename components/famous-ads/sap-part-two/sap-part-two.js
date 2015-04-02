BEST.component('famous-ads:sap-part-two', {
    tree: 'sap-part-two.html',
    behaviors: {
        '#part-two-container': {
            'size': [300, 600],
            'position': function(containerPosition) {
                return containerPosition;
            }
        },
        '#image-a-container': {
            'size': [300, 300],
            'position': function(imageAPosition) {
                return imageAPosition;
            }
        },
        '#image-a': {
            'true-size': true,
            'style': {
                'background-color': 'transparent',
                'color': 'white',
                'z-index': '2'
            }
        },
        '#image-b-container': {
            'position': function(imageBPosition) {
                return imageBPosition;
            }
        },
        '#image-b': {
            'true-size': true,

        },
        '#image-c-container': {
            'position': function(imageCPosition) {
                return imageCPosition;
            }
        },
        '#image-c': {
            'true-size': true,
        },
        '#simple-container': {
            'position': function (simplePosition) {
                return simplePosition;
            }
        },
        '#simple': {
            'style': {
                'color': 'white',
                'font-size': '40px',
                'text-align': 'center',
                'font-weight': 'bold'
            }
        },
        '#has-a-life-container': {
            'position': function(hasALifePosition) {
                return hasALifePosition;
            }
        },
        '#has-a-life': {
            'style': {
                'color': 'white',
                'font-size': '20px',
                'text-align': 'center',
                'font-weight': 'bold'
            }
        },
        '#logo-container': {
            'size': function(logoSize) {
                return logoSize;
            },
            'position': function(logoPosition) {
                return logoPosition;
            }
        },
        '#run-simple-container': {
            'position': function(runSimplePosition) {
                return runSimplePosition;
            }
        },
        '#run-simple': {
            'true-size': true,
            'style': {
                'color': 'white',
                'font-size': '18px',
                'font-weight': '400',
                'text-align': 'center',
            }
        },
        '#learn-more-container': {
            'position': function(learnMorePosition) {
                return learnMorePosition;
            }
        },
        '#learn-more': {
            'true-size': true,
            'style': {
                'color': 'white',
                'font-size': '16px',
                'text-align': 'center',
                'font-weight': 'bold',
                'text-decoration': 'underline',
                'cursor': 'pointer'
            }
        }
    },
    events: {
        public: {
            'start': function(state, message) {
                state.set('_wait', -1, {duration: 2000}, function() {
                    state.set('simplePosition', [-300, 100], {duration: 500, curve: 'easeOut'});
                    state.set('hasALifePosition', [-300, 150], {duration: 500, curve: 'easeOut'});
                    state.set('logoPosition', [90, 110], {duration: 500, curve: 'easeOut'});
                    state.set('runSimplePosition', [150, 160], {duration: 500, curve: 'easeOut'}, function() {
                        state.set('_wait', -1, {duration: 500}, function() {
                            state.set('learnMorePosition', [90, 550], {duration: 500, curve: 'easeOut'});
                        });
                    });
                });
            }
        }
    },
    states: {
        containerPosition: [0, 0],
        imageAPosition: [0, 0],
        imageBPosition: [0, 340],
        imageCPosition: [0, 0],
        simplePosition: [0, 100],
        hasALifePosition: [0, 150],
        logoPosition: [490, 110],
        runSimplePosition: [550, 160],
        learnMorePosition: [490, 550],
        logoSize: [108, 47],
        _wait: -1
    }
});
