BEST.component('famous-demos:ui-element-example', {
    tree: 'ui-element-example.html',
    behaviors: {
        '#root' : {
            size: [200, 200],
            position: [100, 100],
            style: {
                'background-color' : 'black',
                'color' : 'white',
                'line-height' : '200px',
                'font-size' : '20px',
                'text-align' : 'center',
                'cursor' : 'pointer'
            }
        }
    },
    events: {
        public: {
            'handle-click' : function(state, message) {
                console.log('click', message);
            }
        }
    }
});
