FamousFramework.module('famous-tests:control-flow:repeat', {
    behaviors: {
        '.row' : {
            size: [200, 200],
            '$repeat' : function(rowCount) {
                var messages = [];
                for (var i = 0; i < rowCount; i++) {
                    messages.push({
                        'row' : i
                    });
                }
                return messages;
            },
            'position' : function($index, $repeatPayload, horizontalOffset) {
                return [($index) * 50 + horizontalOffset, ($index) * 250];
            }
        },
        '.square': {
            style: {
                'background-color' : '#f2f2f0',
                'font-family': 'monospace',
                'padding' : '20px',
                'box-shadow': '10px 13px 43px 0px rgba(0,0,0,0.75)'
            }
        },
        '.label': {
            style: {
                'color': '#40b2e8',
                'font-weight' : 'bold',
                'font-family' : 'Lato',
                'font-size' : '20px'
            },
            position: [25, 50]
        },
        '.column' : {
            '$repeat' : function(colCount) {
                var messages = [];
                for (var i = 0; i < colCount; i++) {
                    messages.push({
                        'col' : i
                    });
                }
                return messages;
            },
            'position' : function($index, $repeatPayload) {
                return [$index * 300, 0]
            },
        },
    },
    events: {
        '$public': {
            'row-count' : '[[setter|rowCount]]',
            'col-count' : '[[setter|colCount]]',
            'horizontal-offset' : '[[setter|horizontalOffset]]'
        }
    },
    states: {
        rowCount: 5,
        colCount: 3,
        horizontalOffset: 50,
    },
    tree: 'repeat.html',
});
