BEST.component('famous-demos:imti', {
    tree: 'imti.html',
    behaviors: {
        '.square': {
            'size': function(size) {
                return size;
            },
            'position': function(position) {
                return position;
            },
        }
    },
    events: {
        public: {

        }
    },
    states: {}
});
