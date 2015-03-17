BEST.component('jordan:header-footer', {
    tree: 'header-footer.html',
    behaviors: {
        '#headercontainer123': {
            'mount-point': [0.5, 0],
            'align': [0.5, 0],
            'origin': [0.5, 0.5],
            'size': function(size) {
                return size;
            },
            'yield': function(_surrogates) {
                debugger;
                console.log('len',_surrogates.length);

                console.info(_surrogates);
                return _surrogates;
            }
        },
        '#content-container': {
            'mount-point': [.5,.5],
            'align': [0.5, 0.5],
            'origin': [0.5, 0.5],
            'position-y': 100
        },
        '#footer-container': {
            'mount-point': [0.5, 1],
            'align': [0.5, 1],
            'origin': [0.5, 0.5],
            'size': function(size) {
                return size;
            }
        },
        '.header': {
            'style':  {
                'background-color': '#021900',
                'color': '#f3f3f3'
            }
        },
        '.content': {
            'style':  {
                'background-color': '#72E356'
            }
        },
        '.footer': {
            'style':  {
                'background-color': '#6EDB75'
            }
        }
    },
    events: {
        public: {
            'yield': function(state, _surrogates) {
                console.info('state',state._state);
                //state.set('_surrogates', {});
                //debugger;
                state.set('_surrogates', _surrogates);
            }
        }
    },
    states: {
        size: [undefined, 100]
    }
});
