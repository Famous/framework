BEST.component('famous-demos:sap-part-two', {
    tree: 'sap-part-two.html',
    behaviors: {
        '#part-two-container': {
            'size': [300, 600]
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
                'background-color': '#FF0099',
                'color': 'white'
            }
        },
        '#image-b-container': {
            'position': function(imageBPosition) {
                return imageBPosition;
            }
        },
        '#image-b': {
            'true-size': true,
            'style': {
            }

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
                'font-size': '16px',
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
                'text-decoration': 'underline'
            }
        }
    },
    events: {},
    states: {
        imageAPosition: [0, 0],
        imageBPosition: [0, 340],
        simplePosition: [0, 100],
        hasALifePosition: [0, 150],
        logoPosition: [490, 110],
        runSimplePosition: [550, 160],
        learnMorePosition: [490, 550],
        logoSize: [108, 47]
    }
});
