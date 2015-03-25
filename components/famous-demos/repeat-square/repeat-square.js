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
                        position: [Math.random() * 700, Math.random() * 700]
                    });
                };
                return result;
            },
            'position' : function() {
                return [Math.random() * 700, Math.random() * 700]
            },
            'change-color': function(backgroundColor) {
                return backgroundColor;
            }
        },
    },
    events: {
        public: {
            'update-count' : function(state, message) {
                state.chain('count').add(1);
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
