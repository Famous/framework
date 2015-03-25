BEST.component('famous-demos:repeat-square', {
    tree: 'repeat-square.html',
    behaviors: {
        '.square': {
            '$repeat' : function(count) {
                count = count || 1;
                var colors = ['red', 'honeydew', 'lavenderblush', 'olivedrab', 'peru'];
                var result = [];
                for (var i = 0; i < count; i++) {
                    result.push({
                        'change-color' : colors[i % colors.length],
                        'position': [50, 100 + i * 210]
                    });
                };
                return result;
            },
            'change-color': function(backgroundColor) {
                return backgroundColor;
            }
        },
    },
    events: {
        public: {
            'update-count' : function(state, message) {
                state.set('count', message);
            },
            'change-color': function(state, message) {
                state.set('backgroundColor', message);
            }
        }
    },
    states: {
        count: 0,
        backgroundColor: 'red'
    }
});
