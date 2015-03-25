BEST.component('famous-demos:header-footer', {
    tree: 'header-footer.html',
    behaviors: {
        '#header': {
            'mount-point': function() {
                return [0.5, 0]
            },
            'align': function() {
                return [0.5, 0];
            },
            'origin': function() {
                return [0.5, 0.5];
            },
            'size': function(size) {
                return size.header;
            },
            '$yield': '#header'
        },
        '#content': {
            'mount-point': function() {
                return [0.5, 0.5];
            },
            'align': function() {
                return [0.5, 0.5];
            },
            'origin': function() {
                return [0.5, 0.5];
            },
            'size': function(size) {
                var windowHeight = window.innerHeight;
                var contentSize = windowHeight - (size.header[1] + size.footer[1]);
                return [undefined, contentSize];
            },
            '$yield': '#content'
        },
        '#footer': {
            'mount-point': function() {
                return [0.5, 1];
            },
            'align': function() {
                return [0.5, 1];
            },
            'origin': function() {
                return [0.5, 0.5];
            },
            'size': function(size) {
                return size.footer;
            },
            '$yield': '#footer'
        }
    },
    events: {
        public: {
            'headerSize': function(state, payload){
                var size = state.get('size');
                size.header = payload;
                state.set('size', size);
            },
            'footerSize': function(state, payload) {
                var size = state.get('size');
                size.footer = payload;
                state.set('size', size);
            },
            'layoutDirection': function(state, payload) {
                state.set('layout-direction', payload);
            }
        }
    },
    states: {
        size: {
            header: [undefined, 100],
            footer: [undefined, 100]
        }
    }
});
