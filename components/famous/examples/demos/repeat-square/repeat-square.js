BEST.component('famous:examples:demos:repeat-square', {
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
                        'position': [50, 100 + i * 250]
                    });
                };
                return result;
            },
            'change-color': function(_backgroundColor) {
                return _backgroundColor;
            }
        },
        '#root2': {
            'position': function() {
                return [300, 0, 0]
            }
        },
        '.label-view': {
            size: [100, 50]
        }
    },
    events: {
        public: {
            'update-count' : function(state, message) {
                state.set('count', message);
            },
            'change-color': function(state, message) {
                state.set('_backgroundColor', message);
            }
        }
    },
    states: {
        count: 5,
        _backgroundColor: 'red'
    }
});
