var colorSteps = 36;
var colors = [ [151, 131, 242], [47, 189, 232] ];

function getColorStep(step) {
    step -= (step >= colorSteps) ? colorSteps : 0;
    var r = colors[0][0] - Math.round(((colors[0][0] - colors[1][0]) / colorSteps) * step);
    var g = colors[0][1] - Math.round(((colors[0][1] - colors[1][1]) / colorSteps) * step);
    var b = colors[0][2] - Math.round(((colors[0][2] - colors[1][2]) / colorSteps) * step);
    return 'rgb(' + r + ',' + g + ',' + b + ')';
}

FamousFramework.module('famous-demos:dynamic-list', {
    behaviors: {
        '#container': {
            'align': [0.4, 0.1],
        },
        '.button': {
            'size': [100, 50],
            'style': {
                'color': '#F2F2F0',
                'border': '1px solid #7099EE',
                'cursor': 'pointer',
                'text-align' : 'center',
                'font-family' : 'Lato',
                'line-height' : '50px',
                'font-size': '20px',
                'border-radius': '5px'
            },
            'unselectable' : true
        },
        '#add-button': {
            'position': [110, 0]
        },
        '#remove-button': {
            'position': [220, 0]
        },
        '#toggle-button': {
            'position': [0, 0]
        },
        '#blocks-view': {
            'position': [25, 100],
            '$if' : function (showState) {
                return showState;
            }
        },
        '.block': {
            size: function (blockSize) {
                return blockSize;
            },
            '$repeat': function (blockCount, blockSize) {
                var result = [];
                for (var i = 0; i < blockCount; i++) {
                    result.push({
                        position: [0, i * (blockSize[1] + 20)],
                        content: 'Block '+ i
                    });
                }
                return result;
            },
            style: function($index) {
                return {
                    'text-align' : 'center',
                    'line-height' : '100px',
                    'font-size' : '24px',
                    'font-weight' : 'bold',
                    'border': '5px solid #333333',
                    'box-sizing': 'border-box',
                    'font-family': 'Lato',
                    'background-color' : getColorStep($index),
                    'color' : '#F2F2F0',
                    'cursor': 'pointer'
                }
            },
            'unselectable': true,
            'origin' : [0.5, 1],
            'position-x' : function($index, selectedIndex, rotationX) {
                if ($index === selectedIndex) {
                    return rotationX;
                }
                else {
                    return 0;
                }
            }
        },
        'div#toggle-text' : {
            'content' : function(showState) {
                return showState ? 'Hide' : 'Show';
            }
        }
    },
    events: {
        '$public' : {
            'block-count': '[[setter|blockCount]]'
        },
        '#toggle-button': {
            'click': function($state) {
                $state.set('showState', !$state.get('showState'));
            }
        },
        '#add-button': {
            'click': function($state) {
                if ($state.get('showState')) {
                    $state.set('blockCount', $state.get('blockCount') + 1);
                }
            }
        },
        '#remove-button': {
            'click': function($state, $index) {
                if ($state.get('showState') && $state.get('blockCount') > 0) {
                    $state.set('blockCount', $state.get('blockCount') - 1);
                }
            }
        },
        '.block' : {
            'click' : function($state, $payload, $index, $repeatPayload) {
                console.log('Index: ', $index);
                console.log('Repeat Payload: ', $repeatPayload);
                $state.set('selectedIndex', $index);

                var blockWidth = $state.get('blockSize')[0];
                $state.set('rotationX', blockWidth * .25, {duration: 150, curve: 'outExpo'})
                      .thenSet('rotationX', 0, {duration: 200, curve: 'outBounce'});
            }
        }
    },
    states: {
        containerPosition: [100, 100],
        blockSize: [260, 100],
        blockCount: 5,
        showState: true,
        selectedIndex: null,
        rotationX: 0
    },
    tree: 'dynamic-list.html',
});