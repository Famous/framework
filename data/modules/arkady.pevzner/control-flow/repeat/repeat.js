BEST.module('arkady.pevzner:control-flow:repeat', {
    tree: 'repeat.html',
    behaviors: {
        '.view' : {
            size: [200, 200],
            '$repeat' : function(count) {
                var messages = [];
                for (var i = 0; i < count; i++) {
                    messages.push(
                        {'position' : [0, 250 * i]}
                    );
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
        '#column' : {
            '$repeat' : function() {
                return [0, 1, 2];
            },
            'position' : function($index) {
                return [$index * 300, 0]
            }
        },
    },
    events: {
        '$public': {
            'count' : 'setter',
            'horizontal-offset' : 'setter|camel'
        }
    },
    states: {
        count: 3,
        horizontalOffset: 50
    }
});
