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
                'background-color' : 'red',
                'color' : 'white'
            }
        },
        '.label': {
            style: {
                'color': 'blue',
                'font-weight' : 'bold'
            },
            position: [50, 50]
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
            'row-count' : '[[setter|camel]]',
            'col-count' : '[[setter|camel]]',
            'horizontal-offset' : '[[setter|camel]]'
        }
    },
    states: {
        rowCount: 5,
        colCount: 3,
        horizontalOffset: 50,
    },
    tree: 'repeat.html',
});
