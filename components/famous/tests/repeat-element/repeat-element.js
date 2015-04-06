BEST.component('famous:tests:repeat-element', {
    tree: 'repeat-element.html',
    behaviors: {
        '#element' : {
            style: {
                'background-color' : 'black'
            }
        },
        '#view' : {
            'position': [100, 100],
            'size': [100, 100],
            '$repeat' : function(count) {
                var result = [];
                for (var i = 0; i < count; i++) {
                    result.push({
                        'position': [100, i*110 + 100]
                    });
                };
                return result;
            }
        },

    },
    events: {
        public : {
            'update-count' : function(s, m) {
                s.set('count', m);
            }
        }
    },
    states: {
        count: 3
    }
});
