BEST.component('famous-demos:if-repeat', {
    tree: 'if-repeat.html',
    behaviors: {
        '#root': {
            '$if' : function(show) {
                return show;
            }
        },
        '#repeat': {
            '$repeat' : function(count) {
                var result = [];
                for (var i = 0; i < count; i++) {
                    result.push({
                        size: [100, 100],
                        position: [100, 100 + i * 125]
                    });
                };
                return result;
            }
        },
        '.element' : {
            style: {
                backgroundColor: 'gray',
                color: 'white'
            }
        }
    },
    events: {
        public: {
            'update-count' : function(state, message) {
                state.set('count', message);
            }
        }
    },
    states: {
        count: 1,
        show: false
    }
});
