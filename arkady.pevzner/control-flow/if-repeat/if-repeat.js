BEST.module('arkady.pevzner:control-flow:if-repeat', 'HEAD', {
    behaviors: {
        '#container' : {
            position: '[[identity|containerPosition]]'
        },
        '.button' : {
            size: [75, 25],
            style: {
                border: '1px solid black',
                cursor: 'pointer',
                'text-align' : 'center',
                'font-family' : 'monospace',
                'line-height' : '25px'
            },
            'unselectable' : true
        },
        '#add-button' : {
            position: [80, 0]
        },
        '#remove-button' : {
            position: [160, 0]
        },
        '#blocks-view' : {
            position: [0, 50],
            '$if' : function (toggleState) {
                return toggleState;
            }
        },
        '.block' : {
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
            style: {
                'text-align' : 'center',
                'line-height' : '100px',
                'font-size' : '24px',
                'font-weight' : 'bold',
                'border': '5px solid black',
                'box-sizing': 'border-box',
                'background-color' : 'gray',
                'color' : 'white'
            }
        }
    },
    events: {
        '#toggle-button' : {
            'ui-click': function($state) {
                $state.set('toggleState', !$state.get('toggleState'));
            }
        },
        '#add-button' : {
            'ui-click': function($state) {
                if ($state.get('toggleState')) {
                    $state.chain('blockCount').add(1);
                }
            }
        },
        '#remove-button' : {
            'ui-click': function($state) {
                if ($state.get('toggleState') && $state.get('blockCount') > 0) {
                    $state.chain('blockCount').subtract(1);
                }
            }
        }
    },
    states: {
        containerPosition: [100, 100],
        blockSize: [260, 100],
        blockCount: 5,
        toggleState: true
    },
    tree: 'if-repeat.jade',
});