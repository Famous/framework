BEST.component('famous-demos:colorful-square-demo', {
    tree: 'colorful-square-demo.html',
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
