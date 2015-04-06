BEST.component('famous:examples:ads:sap:part-two', {
    tree: 'part-two.html',
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
            'position': function (time, simplePosition) {
                return $B.timeline([
                    [0,     simplePosition],
                    [1500,  simplePosition, 'easeOut'],
                    [2000,  [-300, 100]]
                ])(time);
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
            'position': function(time, hasALifePosition) {
                return $B.timeline([
                    [0,  hasALifePosition],
                    [1500,  hasALifePosition, 'easeOut'],
                    [2000,  [-300, 150]]
                ])(time);
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
            'position': function(time, logoPosition) {
                return $B.timeline([
                    [0,     logoPosition],
                    [1500,  logoPosition, 'easeOut'],
                    [2000,  [90, 110]]
                ])(time);
            }
        },
        '#run-simple-container': {
            'position': function(time, runSimplePosition) {
                return $B.timeline([
                    [0,     runSimplePosition],
                    [1500,  runSimplePosition, 'easeOut'],
                    [2000,  [150, 160]]
                ])(time);
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
            'position': function(time, learnMorePosition) {
                return $B.timeline([
                    [0,     learnMorePosition],
                    [2000,  learnMorePosition, 'easeOut'],
                    [2500,  [90, 550]]
                ])(time);
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
            'start-two': function(state, message) {
                if (!state.get('animationStarted') && message === 1) {
                    state.set('time', 2500, {duration: 2500});
                    state.set('animationStarted', true);
                }
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
        time: 0,
        animationStarted: false
    }
});
