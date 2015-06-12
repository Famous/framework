const LETTER_SPACING = 0.167;

function getLetterPosition(val) {
    return ~~(LETTER_SPACING * val * 100) / 100;
}

FamousFramework.module('creative:sephora', {
    behaviors: {
        '#background': { 'style': { background: '#000', 'z-index': 1 } },
        '#bottle': { 'type': 'bottle' },
        '#bottle-label': { 'type': 'bottle-label' },
        '#five-black': { 'type': 'five-black', 'opacity': 0 },
        '#five-color': { 'type': 'five-color', 'opacity': 0 },
        '#five-light': { 'type': 'five-light', 'opacity': 1 },
        '#light': { 'type': 'light' },
        '#sephora-container': {
            'align': [0.5, 0.5, 0.5], 'mount-point': [0.5, 0.5, 0.5], 'origin': [0.5, 0.5, 0.5],
            'overflow': 'hidden',
            'size': [320, 568],
            'style': {
                'background': '#000',
                'border': '1px solid #FFFFFF',
                'overflow': 'hidden',
                'z-index': 2
            }
        },
        '#container-bottle': {
            'align': [0.5, 0.5, 0.5], 'mount-point': [0.5, 0.5, 0.5], 'origin': [0.5, 0.5, 0.5],
            'position': [0, 0, 0]
        },
        '#container-letter': {
            'align': [0.5, 0.5, 0.5], 'mount-point': [0.5, 0.5, 0.5], 'origin': [0.5, 0.5, 0.5],
            'position': [0, 205, 0], 'size': [220, 36]
        },
        '#getit': { 'type': 'getit', 'position': [0, 210, 0] },
        '#intro1': {
            size: [20, 46],
            position: [95, -116]
        },
        '#intro2': {
            size: [220, 180],
            position: [0, 46]
        },
        '#intro3': {
            size: [150, 10],
            position: [11, -95]
        },
        '#intro4': {
            size: [16, 60],
            position: [-48, -78]
        },
        '#intro5': {
            size: [156, 40],
            position: [-20, -3]
        },
        '#letter-s': { 'type': 'letter-s', 'align': [getLetterPosition(0), 0.5, 0.5] },
        '#letter-e': { 'type': 'letter-e', 'align': [getLetterPosition(1), 0.5, 0.5] },
        '#letter-p': { 'type': 'letter-p', 'align': [getLetterPosition(2), 0.5, 0.5] },
        '#letter-h': { 'type': 'letter-h', 'align': [getLetterPosition(3), 0.5, 0.5] },
        '#letter-o': { 'type': 'letter-o', 'align': [getLetterPosition(4), 0.5, 0.5] },
        '#letter-r': { 'type': 'letter-r', 'align': [getLetterPosition(5), 0.5, 0.5] },
        '#letter-a': { 'type': 'letter-a', 'align': [getLetterPosition(6), 0.5, 0.5] },
        '#no': { 'type': 'no', 'position': [-410, -10, 0] }
    },
    events: {
        '$lifecycle': {
            'post-load': function($timelines) {
                setTimeout(function() {
                    $timelines.cue([
                        ['intro-animation', {duration: 1800}, ()=>{ console.log('done 1'); }],
                        ['intro-animation2', {duration: 1800}, ()=>{ console.log('done 2'); }]
                    ], function() {
                        console.log('complete!');
                    }).startCue();
                }, 1000);
            }
        }
    },
    states: {
    },
    tree: 'sephora.html'
})
.timelines({
    'intro-animation': {
        '#intro1': {
            'position': {
                '0%': { value: [95, -116] },
                '33%': { value: [95, -70] }
            }
        },
        '#intro2': {
            'position': {
                '0%': { value: [0, 46] },
                '83%': { value: [220, 46] }
            }
        }
    },
    'intro-animation2': {
        '#intro3': {
            'position': {
                '0%': { value: [11, -95] },
                '33%': { value: [11, -95] },
                '61%': { value: [-126, -95] }
            }
        },
        '#intro4': {
            'position': {
                '0%': { value: [-48, -78] },
                '56%': { value: [-48, -78] },
                '78%': { value: [-48, -14] }
            },
            'size': {
                '0%': { value: [16, 60] },
                '56%': { value: [16, 60] },
                '78%': { value: [16, 1] }
            }
        },
        '#intro5': {
            'position': {
                '0%': { value: [-20, -3] },
                '58%': { value: [-20, -3] },
                '100%': { value: [-175, -3] }
            }
        }
    }
})
.config({
    imports: {
        'creative:sephora': ['mask', 'sprite']
    },
    includes: ['sephora.css']
});
